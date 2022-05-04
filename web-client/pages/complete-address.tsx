import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Button from "../components/button";
import { getUserProfile } from "../service/auth";
import { getCartData } from "../service/cart";
import { getCookie } from "../utils/cookieHandler";
import ParseSSRCookie from "../utils/ssrCookieParser";

interface IPropsCompleteAddress {
  data: {
    id: string;
    username: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    UserAddress: {
      id: string;
      user_id: string;
      address_id: number;
      address_name: string;

      address_type: string;
      complete_address: string;
    };
  };
  status: "success" | "error";
}

const CompleteAddress: NextPage<IPropsCompleteAddress> = ({
  data,
  status,
}: IPropsCompleteAddress) => {
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [addressesList, setAddressesList] = useState<
    { label: string; id: string; type: string }[]
  >([]);
  const [addresslistHeight, setAddresslistHeight] = useState<number>(0);
  const timeoutSearch = useRef<any>();
  const [focus, setFocus] = useState<boolean>(false);
  const [error, setError] = useState<{ [name: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const queryAddress = async (name: string) => {
    try {
      setLoadingQuery(true);
      setAddressesList([]);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ONGKIR_URL}/search?location=${name}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setAddressesList(data.data);
        setTimeout(() => {
          setAddresslistHeight(
            (
              document.querySelector(
                "#container-address-wrapper"
              ) as HTMLDivElement
            ).scrollHeight + 20
          );
        }, 50);
      } else {
        throw new Error(data.message);
      }
      setLoadingQuery(false);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }

      setLoadingQuery(false);
    }
  };

  const HandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutSearch.current);
    setAddresslistHeight(0);
    if (!!e.target.value) {
      timeoutSearch.current = setTimeout(() => {
        queryAddress(e.target.value);
      }, 500);
    } else {
      const DetailAddressElement = document.querySelector(
        "input[name='address-detail']"
      ) as HTMLInputElement;
      DetailAddressElement.value = "";
    }
  };

  const HandleClick = (value: string) => {
    setError((prev) => ({ ...prev, ["address-query"]: false }));
    const InputElement = document.querySelector(
      "input[name='address-query']"
    ) as HTMLInputElement;
    const DetailAddressElement = document.querySelector(
      "input[name='address-detail']"
    ) as HTMLInputElement;
    InputElement.value = value.split("-").pop() as string;
    DetailAddressElement.value = value;
    setAddresslistHeight(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const AddressData = (e.target as any)["address-detail"].value;
    const AddressDetail = (e.target as any)["detail-address"].value;

    if (!AddressData) {
      setError((prev) => ({ ...prev, ["address-query"]: true }));
      return;
    }

    if (!AddressDetail) {
      setError((prev) => ({ ...prev, ["detail-address"]: true }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
            Authorization: getCookie("access_token"),
          },
          body: JSON.stringify({
            address_id: Number(AddressData.split("-")[0]),
            address_name: AddressData.split("-")[2],
            address_type: AddressData.split("-")[1],
            complete_address: AddressDetail,
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

        setLoading(false);
      } else {
        getUserProfile();
        router.replace("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      data.UserAddress.address_id !== 0 &&
      data.UserAddress.address_name !== "" &&
      data.UserAddress.address_type !== "" &&
      data.UserAddress.complete_address !== ""
    ) {
      getUserProfile();
      getCartData();
      router.replace("/");
    }
  }, [data]);

  return (
    <div className="w-screen min-h-screen flex justify-center bg-app-bg-primary text-white">
      <div className="mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Complete Your Address</h1>
          <p className="text-app-secondary">
            Complete your address to make your experience better
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="mb-2">Select City or Subdistrict</div>
            <div className="relative w-full ">
              <div
                className={`border-2 rounded-md ${
                  !!error["address-query"]
                    ? "border-app-danger"
                    : focus
                    ? "border-app-primary"
                    : "border-app-secondary"
                }`}
              >
                <div className="flex flex-row items-center">
                  <input
                    name="address-query"
                    className="bg-transparent w-full p-2 outline-none"
                    placeholder="Enter City or Subdistrict"
                    onChange={HandleSearch}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                  />
                  <div className="px-2">
                    {loadingQuery && (
                      <>
                        <svg
                          className={`animate-spin h-5 w-5 text-white`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </>
                    )}
                  </div>
                </div>

                <input className="" type={"hidden"} name="address-detail" />
              </div>

              <div
                className={`w-full bg-app-bg-input rounded-md  mt-2 absolute transition-all duration-500 ${
                  addresslistHeight !== 0
                    ? "overflow-auto py-2"
                    : "overflow-hidden"
                }`}
                style={{ height: addresslistHeight + "px", maxHeight: "150px" }}
                id="container-address-wrapper"
              >
                {addressesList.length === 0 ? (
                  <div className="p-2">Not Found</div>
                ) : (
                  addressesList.map((item, index) => (
                    <div
                      className="p-2 hover:bg-app-primary cursor-pointer"
                      onClick={() =>
                        HandleClick(`${item.id}-${item.type}-${item.label}`)
                      }
                      key={index}
                    >
                      {item.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="mb-2">Detail Address</div>
            <textarea
              name="detail-address"
              className={`w-full bg-transparent border-2 ${
                !!error["detail-address"]
                  ? "border-app-danger"
                  : "border-app-secondary focus:border-app-primary"
              } rounded-md p-2 outline-none `}
              placeholder="Your Address Detail"
              onChange={(e) => {
                if (!!e.target.value) {
                  setError((prev) => ({ ...prev, ["detail-address"]: false }));
                }
              }}
            />
          </div>
          <Button
            className="w-full p-4 bg-app-primary rounded-md disabled:bg-opacity-30"
            disabled={
              Object.values(error)
                .map((item) => item)
                .filter((item) => item === true).length > 0
            }
            onClick={() => {}}
            loading={loading}
            type="submit"
          >
            Sumbit
          </Button>
        </form>
      </div>
    </div>
  );
};

CompleteAddress.getInitialProps = async (ctx: NextPageContext) => {
  let props: IPropsCompleteAddress = {
    data: {
      id: "",
      username: "",
      name: "",
      role: "",
      phone: "",
      email: "",
      UserAddress: {
        id: "",
        user_id: "",
        address_id: 0,
        address_name: "",

        address_type: "",
        complete_address: "",
      },
    },
    status: "error",
  };

  let accesstoken = "";
  if (ctx.req) {
    accesstoken = ParseSSRCookie(ctx, "access_token");
  } else {
    accesstoken = getCookie("access_token");
  }
  if (!accesstoken && !!ctx.res) {
    ctx.res.writeHead(301, {
      Location: "/",
    });
    ctx.res.end();
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      method: "GET",
      headers: {
        Authorization: accesstoken,
      },
    }
  );

  const data = await response.json();
  props = data;
  return props;
};

export default CompleteAddress;
