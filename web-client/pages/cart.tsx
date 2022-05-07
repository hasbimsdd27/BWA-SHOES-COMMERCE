import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Button from "../components/button";
import CustomCheckbox from "../components/customCheckbox";
import Layout from "../components/layout";
import { SetCheckoutData } from "../redux/action/checkout";
import { IRootReducer } from "../redux/reducer/rootReducer";
import { getCartData } from "../service/cart";
import { getCookie } from "../utils/cookieHandler";

function Checkout() {
  const userCart = useSelector((reducer: IRootReducer) => reducer.CartReducer);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const ToggleSelected = (id: string) => {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((item: string) => item !== id));
    } else {
      setSelected((prev) => [...prev, id]);
    }
  };

  let totalPrice = 0;

  const deleteSelected = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure want to these items?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleteLoading(true);
        Promise.all(
          selected.map(
            async (item: string) =>
              await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item}`, {
                method: "DELETE",
                headers: {
                  Authorization: getCookie("access_token"),
                  "Content-type": "application/json;charset=UTF-8",
                },
              })
          )
        )
          .then(() => {
            getCartData();
            setSelected([]);
          })
          .finally(() => {
            setDeleteLoading(false);

            Swal.fire({
              icon: "success",
              title: "Success",
              text: "product deleted from your cart",
            });
          });
      }
    });
  };

  selected.forEach((item) => {
    const data = userCart.data.find((item2) => item2.id === item);
    totalPrice += (data?.product?.price || 0) * (data?.quantity || 0);
  });

  const HandlePostUpdate = async (e: number, id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: {
          Authorization: getCookie("access_token"),
          "Content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          product_id: id,
          quantity: e,
        }),
      });

      getCartData();
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <Layout>
        <div className="flex flex-row justify-center text-app-white">
          <div className="md:w-[450px] sm:w-full h-full">
            <div className="text-xl py-2 border-b-2 border-app-white">
              Your Cart
            </div>
            <div className="my-4">
              {userCart.data.map((item, index) => (
                <div className="flex flex-row items-center my-4" key={index}>
                  <div>
                    <CustomCheckbox
                      defaultChecked={false}
                      onChange={() => {
                        ToggleSelected(item.id);
                      }}
                      id={`checked-quantity-${item.id}`}
                      name={`checked-quantity-${item.id}`}
                      label=""
                      value={item.id}
                    />
                  </div>
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
                      onBlur={(e) =>
                        HandlePostUpdate(
                          Number(e.target.value),
                          item.product.id
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`fixed bottom-5 pb-5 transition-all duration-200 transform sm:pr-8 md:pr-0 ${
                selected.length > 0 ? "translate-y-0" : "translate-y-52"
              }`}
              style={{ width: "inherit" }}
            >
              <div className="border-t-2 border-app-white mb-5" />
              <div className="flex flex-row text-xl mb-2">
                <div className="flex flex-1">Total</div>
                <div className="font-bold">
                  {totalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="flex md:flex-row sm:flex-col">
                <Button
                  className="w-full bg-app-danger py-2 rounded-md cursor-pointer sm:mb-2 md:mb-0 md:mr-1"
                  type="button"
                  onClick={() => {
                    deleteSelected();
                  }}
                  loading={deleteLoading}
                >
                  <span>Delete ({selected.length})</span>
                </Button>
                <Button
                  className="w-full bg-app-primary py-2 rounded-md cursor-pointer font-bold sm:ml-0 md:ml-1"
                  type="button"
                  onClick={() => {
                    dispatch(
                      SetCheckoutData({
                        items: userCart.data.filter((item) =>
                          selected.includes(item.id)
                        ),
                      }) as any
                    );

                    router.push("/checkout");
                  }}
                >
                  <span> Checkout ({selected.length})</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Checkout;
