import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Button from "../components/button";
import Layout from "../components/layout";
import { IRootReducer } from "../redux/reducer/rootReducer";
import { getCookie } from "../utils/cookieHandler";

const Checkout: NextPage = () => {
  const router = useRouter();
  const [shipping, setShipping] = useState<{
    weight: string;
    from: string;
    to: string;
    loading: boolean;
    courrier: {
      nama: string;
      nama_layanan: string;
      kode_layanan: string;
      harga: number;
      ETA: string;
    }[];
  }>({
    weight: "",
    from: "",
    to: "",
    loading: false,
    courrier: [],
  });

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [selectedCourier, setSelectedCourier] = useState<number>(-1);

  const CheckoutData = useSelector(
    (reducer: IRootReducer) => reducer.CheckoutReducer
  );
  const userData = useSelector((reducer: IRootReducer) => reducer.AuthReducer);

  const HandleCheckOngkir = useCallback(
    async (addressId: number, addressType: string) => {
      try {
        setShipping((prev) => ({
          ...prev,
          loading: true,
        }));
        const payload = {
          destination: addressId,
          destination_type: addressType,
          weight: Math.ceil(
            CheckoutData.items.reduce(
              (total, item) => (total += item.product.weight),
              0
            )
          ),
          courier: ["jne", "pos", "sicepat", "jnt", "wahana", "tiki"],
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ongkir/cost`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json;charset=UTF-8",
              Authorization: getCookie("access_token"),
            },
            body: JSON.stringify(payload),
          }
        );
        const parsedResponse = await response.json();
        setShipping({
          weight: parsedResponse.data.berat,
          from: parsedResponse.data.dari,
          to: parsedResponse.data.ke,
          courrier: parsedResponse.data.kurir,
          loading: false,
        });
      } catch (error) {
        if (error instanceof Error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        }
        setShipping((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    },
    [CheckoutData]
  );

  const HandleCreateTransaction = async () => {
    try {
      setLoadingSubmit(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
            Authorization: getCookie("access_token"),
          },
          body: JSON.stringify({
            cart_ids: CheckoutData.items.map((item) => item.id),
            courier_name: shipping.courrier[selectedCourier].nama,
            service_code: shipping.courrier[selectedCourier].kode_layanan,
          }),
        }
      );
      if (res.status >= 400) {
        const json = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: json.message,
        });
        setLoadingSubmit(false);
      } else {
        const json = await res.json();
        window.open(json.data.redirect_url);
        router.push("/");
      }
      setLoadingSubmit(false);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    HandleCheckOngkir(
      userData.UserAddress.address_id,
      userData.UserAddress.address_type
    );
  }, [userData]);

  const totalPrice = CheckoutData.items.reduce(
    (total, item) => (total += item.product.price * item.quantity),
    0
  );

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <Layout>
        <div className="flex flex-row justify-center text-app-white">
          <div className="md:w-[450px] sm:w-full h-full pb-32">
            <div className="text-xl mb-4">Checkout</div>
            <div className="mb-8">
              <div>Items</div>
              <div>
                {CheckoutData.items.map((item, index) => (
                  <div className="flex flex-row items-center my-4" key={index}>
                    <div
                      className="h-16 w-16 rounded-md mx-2"
                      style={{
                        backgroundImage: `url("${item.product.Galeries[0].url}")`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <div className="flex flex-col flex-1">
                      <div>{item.product.name}</div>
                      <div className="text-sm text-app-secondary">
                        {item.product.Category.name}
                      </div>
                      <div className="text-sm text-app-info">
                        {item.product.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="flex items-center flex-col justify-center text-xl">
                      <input
                        className="w-10 text-center bg-app-bg-input rounded-md border-2 border-app-secondary outline-none focus:border-app-primary"
                        defaultValue={item.quantity}
                        name={`quantity-${item.id}`}
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div>Select Courier</div>
              <div className="grid sm:grid-cols-1  sm:gap-1 md:grid-cols-2 md:gap-2">
                {shipping.loading
                  ? Array(4)
                      .fill(0, 0, 4)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="w-auto p-2 my-2 border-2 rounded-md border-app-secondary flex flex-row h-24 animate-pulse bg-gray-800"
                        ></div>
                      ))
                  : shipping.courrier.map((item, index) => (
                      <div
                        key={index}
                        className={`w-auto p-2 my-2 border-2 rounded-md  flex flex-row cursor-pointer ${
                          selectedCourier === index
                            ? "border-app-primary"
                            : "border-app-secondary"
                        }`}
                        onClick={() => {
                          setSelectedCourier(index);
                        }}
                      >
                        <div className="flex flex-1 flex-col">
                          <div className="flex flex-row">
                            <div className=" mb-2 flex flex-1 flex-col">
                              <div className="text-xl font-bold">
                                {item.nama.includes("(")
                                  ? item.nama.split("(")[1].replace(")", "")
                                  : item.nama.split(" ")[0]}{" "}
                              </div>
                              <div className="text-sm text-gray-600">
                                {item.kode_layanan}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.ETA}
                            </div>
                          </div>

                          <div className="text-right text-app-teal">
                            {item.harga.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            <div className="relative">
              {selectedCourier > -1 && (
                <div className="sticky bottom-0">
                  <Button
                    className="w-full py-2 bg-app-primary mt-2"
                    loading={loadingSubmit}
                    onClick={() => HandleCreateTransaction()}
                  >
                    <>
                      Checkout (
                      {(
                        totalPrice + shipping.courrier[selectedCourier].harga
                      ).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                      )
                    </>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Checkout;
