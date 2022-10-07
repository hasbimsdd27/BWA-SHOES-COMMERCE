import express, { Request, Response } from "express";
import cors from "cors";
import responseTime from "response-time";
import { ConnectDB, GetDB } from "./libs/db";
import crypto from "crypto";
import { MindtransPayload } from "./types/midtrans";
import { RowDataPacket } from "mysql2";
import "isomorphic-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    const Log = [
      new Date().toString().split(" ")[4],
      res.statusCode,
      (time > 1000 ? time / 1000 : time).toLocaleString("id-ID", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + (time > 1000 ? " s" : " ms"),
      req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      req.method,
      req.url,
    ].join(" | ");
    console.log(Log);
  })
);

app.post("/create", async (req: Request, res: Response) => {
  try {
    const db = GetDB();
    const body: MindtransPayload = req.body;
    const newId = crypto.randomUUID();
    if (!body?.payload?.transaction_details?.order_id || !body?.webhook_url) {
      return res.status(400).send({
        status: "error",
        message: "please fill all required fields",
      });
    }
    await db.query(
      `INSERT INTO payment_request_data (id, source_id, webhook_url )
    VALUES (?,?,?)`,
      [newId, body.payload.transaction_details.order_id, body.webhook_url]
    );

    body.payload.transaction_details.order_id = newId;

    const resultCurl = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString(
              "base64"
            ),
        },
        body: JSON.stringify(body.payload),
      }
    );

    console.log(resultCurl);

    return res.status(200).json({
      status: "success",
      data: await resultCurl.json(),
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
});

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    const body: { [keyName: string]: any } = req.body;
    const db = GetDB();

    const SelfSignatureKey = crypto
      .createHash("sha512")
      .update(
        [
          body["order_id"],
          body["status_code"],
          body["gross_amount"],

          process.env.MIDTRANS_SERVER_KEY,
        ].join("")
      )
      .digest("hex");

    if (SelfSignatureKey !== body["signature_key"]) {
      return res.status(400).json({
        status: "error",
        message: "invalid signature key",
      });
    }

    const [data] = await db.query(
      `SELECT * FROM payment_request_data WHERE id = ?`,
      [body["order_id"]]
    );
    const result = <RowDataPacket[]>data;

    if (result.length === 0) {
      return res.status(404).json({
        sstatus: "error",
        message: "id not found",
      });
    }

    delete body["signature_key"];
    body["order_id"] = result[0].source_id;

    const resWebhook = await fetch(result[0].webhook_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resBody = await resWebhook.json();
    const textBody = JSON.stringify(body);
    await db.query(
      `UPDATE payment_request_data SET is_receive_webhook = true, client_webhook_status_code = ${
        resWebhook.status
      }, midtrans_webhook_payload = '${textBody}', client_webhook_status_response = '${JSON.stringify(
        resBody
      )}' WHERE id = "${body["order_id"]}" `
    );

    return res.status(200).json({
      status: "success",
      message: "webhook success",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  ConnectDB();
  console.log(`App running on port`, PORT);
});
