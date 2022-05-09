import mysql from "mysql2/promise";

let DB: mysql.Connection;

export const ConnectDB = async () => {
  DB = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });
};

export const GetDB = () => DB;
