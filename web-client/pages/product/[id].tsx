import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import SVGAssets from "../../assets/svg";
import Layout from "../../components/layout";
import { IRootReducer } from "../../redux/reducer/rootReducer";

interface IParamsDetail {
  data: {
    product: {
      id: string;
      name: string;
      price: number;
      description: string;
      tags: string;
      category_id: string;
      Galeries: { id: string; url: string }[];
      Category: {
        id: string;
        name: string;
      };
    };
    origin: {
      address_name: string;
      address_id: number;
      address_type: string;
    };
  };

  error: {
    isError: boolean;
    errorMessage: string;
  };
}

const Products: NextPage<IParamsDetail> = ({ data, error }) => {
  const [selected, setSelected] = useState<number>(0);
  const [showShipping, setShowShipping] = useState<boolean>(false);
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

  const shippingHeight = useRef<number>(0);

  const HandleClickImage = (left: number) => {
    if (!!document.querySelector("#galery-wrapper"))
      (document.querySelector("#galery-wrapper") as HTMLDivElement).scrollTo({
        left,
        behavior: "smooth",
      });
  };

  const userData = useSelector((reducer: IRootReducer) => reducer.AuthReducer);

  const HandleCheckOngkir = useCallback(
    async (addressId: number, addressType: string) => {
      try {
        setShipping((prev) => ({
          ...prev,
          loading: true,
        }));
        const payload = {
          origin: addressId,
          origin_type: addressType,
          destination: data.origin.address_id,
          destination_type: data.origin.address_type,
          weight: 1,
          courier: ["jne", "pos", "sicepat", "jnt", "wahana", "tiki"],
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ONGKIR_URL}/cost`,
          {
            method: "POST",
            headers: { "Content-type": "application/json;charset=UTF-8" },
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
        shippingHeight.current = (
          document.querySelector("#shipping-wrapper") as HTMLDivElement
        ).scrollHeight;
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
    []
  );

  useEffect(() => {
    if (
      !!userData.UserAddress.address_id &&
      !!userData.UserAddress.address_type
    ) {
      HandleCheckOngkir(
        userData.UserAddress.address_id,
        userData.UserAddress.address_type
      );
    }
  }, [userData]);

  return (
    <Layout>
      <>
        {" "}
        <Head>
          <title> {data.product.name}</title>
        </Head>
        <div className="mt-8">
          {error.isError ? (
            <div className="w-full flex items-center justify-center">
              <div className="p-8 text-white bg-app-primary rounded-md">
                <div className="text-center mb-4">
                  <span className="text-5xl ">😭</span>
                </div>
                <div className="text-center">{error.errorMessage}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-row sm:flex-col lg:flex-row text-white">
              <div className="flex items-center justify-center">
                <div
                  className="flex flex-col p-4 h-full relative"
                  style={{ width: 425 }}
                >
                  <div className="lg:fixed sm:block">
                    <div
                      className="overflow-hidden mb-4 sticky bottom-0"
                      id="galery-wrapper"
                      style={{ width: 375 }}
                    >
                      <div className="flex flex-row flex-nowrap">
                        {data.product.Galeries.map((item, index) => (
                          <div
                            key={index}
                            style={{ minWidth: 400, minHeight: 405 }}
                            className=" flex items-center justify-start"
                          >
                            <div
                              key={index}
                              className="rounded-md w-full h-full"
                              style={{
                                width: 375,
                                backgroundImage: `url("${item.url}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                              }}
                            />
                          </div>
                        ))}
                      </div>{" "}
                    </div>

                    <div className="flex flex-row items-center justify-center flex-wrap">
                      {data.product.Galeries.map((item, index) => (
                        <div
                          key={index}
                          className={`m-1 p-1 rounded-md cursor-pointer transition-all duration-75 border-2 ${
                            selected === index
                              ? " border-app-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => {
                            setSelected(index);
                            HandleClickImage(index * 400);
                          }}
                        >
                          <img
                            src={item.url}
                            className="h-14 w-14 rounded-md cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 bg-app-bg-input rounded-md p-4 ">
                <div className="flex flex-row sm:flex-col md:flex-row  mb-10">
                  <div className="flex flex-1 flex-col sm:items-start">
                    <h1 className="text-2xl font-bold mb-1">
                      {data.product.name}
                    </h1>
                    <small className="text-app-secondary text-lg">
                      {data.product.Category.name}
                    </small>
                  </div>
                  <div>
                    <div className="text-3xl text-app-teal sm:text-right">
                      {data.product.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
                <div className="mb-16">
                  <div className="text-xl font-bold mb-2">Description</div>
                  <p>{data.product.description}</p>
                </div>
                <div className="mb-8">
                  <div
                    className="cursor-pointer flex flex-row "
                    onClick={() => {
                      setShowShipping((prev) => !prev);
                    }}
                  >
                    <div className="text-xl font-bold mb-4 flex flex-1">
                      Show Shipping Price
                    </div>
                    <div>
                      <SVGAssets.ChevronRight
                        className={`transform transition-all duration-200 ${
                          showShipping ? "-rotate-90 " : "rotate-90"
                        }`}
                      />
                    </div>
                  </div>

                  <div
                    className="transition-all duration-200 overflow-hidden grid sm:grid-cols-1  sm:gap-1 md:grid-cols-2 xl:grid-cols-3 md:gap-2"
                    id="shipping-wrapper"
                    style={{
                      height: showShipping
                        ? `${shippingHeight.current}px`
                        : "0px",
                    }}
                  >
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
                            className="w-auto p-2 my-2 border-2 rounded-md border-app-secondary flex flex-row"
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
                <div className="flex flex-row">
                  <div className="flex flex-1 items-center justify-end px-2">
                    <button className="px-2 py-4 bg-app-info rounded-md">
                      Add to cart
                    </button>
                  </div>
                  <div className="flex flex-1 items-center justify-start px-2">
                    <button className="px-2 py-4 bg-app-primary rounded-md">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </Layout>
  );
};

Products.getInitialProps = async (ctx: NextPageContext) => {
  const props = {
    data: {
      product: {
        id: "",
        name: "",
        price: 0,
        description: "",
        tags: "",
        category_id: "",
        Galeries: [],
        Category: {
          id: "",
          name: "",
        },
      },
      origin: {
        address_name: "",
        address_id: 0,
        address_type: "",
      },
    },
    error: {
      isError: false,
      errorMessage: "",
    },
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${ctx.query.id}`
    );
    if (res.status >= 400) {
      const json = await res.json();
      throw new Error(json.message);
    } else {
      const json = await res.json();
      props.data = json.data;
    }
  } catch (error) {
    console.log(error);
    props.error.isError = true;
    if (error instanceof Error) {
      props.error.errorMessage = error.message;
    }
    props.error.errorMessage = "something went wrong";
  }

  return props;
};

export default Products;
