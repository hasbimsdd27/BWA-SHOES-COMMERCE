import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import SVGAssets from "../../assets/svg";
import { IRootReducer } from "../../redux/reducer/rootReducer";
import { deleteAllCookies } from "../../utils/cookieHandler";
import Dropdown from "../Dropdown";

const Navbar = () => {
  const [focus, setFocus] = useState({
    searchInput: false,
  });
  const router = useRouter();

  const userData = useSelector((reducer: IRootReducer) => reducer.AuthReducer);
  const cartData = useSelector((reducer: IRootReducer) => reducer.CartReducer);

  const HandleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to Log out?",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        deleteAllCookies();
        router.replace("/login");
      }
    });
  };

  return (
    <div className="w-screen flex flex-row items-center justify-center h-16 z-10">
      <div
        className="max-w-screen-2xl w-full flex flex-row p-4 fixed bg-app-bg-primary"
        style={{ width: "inherit" }}
      >
        <div
          className="lg:px-4 sm:px-2 flex flex-row items-center justify-center cursor-pointer"
          onClick={() => {
            router.push({
              pathname: "/",
            });
          }}
        >
          <SVGAssets.MainLogoIcon className="h-8 w-8 mr-4" />
          <div className="text-white sm:hidden md:block">
            <div>Shoes</div>
            <div>Commerce</div>
          </div>
        </div>
        <div className="flex flex-1 lg:px-12 sm:px-2">
          <form
            className={`w-full h-full justify-center items-center flex flex-row border px-4 rounded-md transition-all duration-200 ${
              focus.searchInput ? "border-app-primary" : "border-app-secondary"
            }`}
            onSubmit={(e) => {
              e.preventDefault();
              router.push({
                pathname: "/search",
                query: {
                  q: (e.target as any).q.value,
                  page: 1,
                },
              });
            }}
          >
            <div className="flex flex-1 mr-4">
              {" "}
              <input
                className="w-full bg-transparent outline-none text-white"
                placeholder="Enter Product Name"
                onFocus={() =>
                  setFocus((prev) => ({ ...prev, searchInput: true }))
                }
                onBlur={() =>
                  setFocus((prev) => ({ ...prev, searchInput: false }))
                }
                name="q"
                defaultValue={router.query.q}
              />
            </div>
            <button type="submit" className="appearance-none">
              <SVGAssets.SearchIcon
                className={`h-4 w-4 transition-all duration-200 ${
                  focus.searchInput ? "fill-app-primary" : "fill-app-secondary"
                } `}
              />
            </button>
          </form>
        </div>
        <div className="lg:px-4 sm:px-2 flex flex-row items-center justify-center">
          <div className="mr-4 cursor-pointer">
            <Dropdown
              renderLabel={<SVGAssets.CartIcon className="h-6 w-6" />}
              id="cart-button"
              width="225px"
            >
              <div className="px-2">
                {cartData.data.length === 0 ? (
                  <div className="text-app-info text-center">
                    Your Cart Is Empty
                  </div>
                ) : (
                  <div>
                    <div
                      className="w-full overflow-auto"
                      style={{ maxHeight: "180px" }}
                    >
                      {cartData.data.map((item, index) => (
                        <div key={index} className="flex flex-row my-2">
                          <div
                            className="w-16 h-16 rounded-md mr-2"
                            style={{
                              backgroundImage: `url("${item.product.Galeries[0].url}")`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                            }}
                          ></div>
                          <div className="flex flex-1 flex-col">
                            <div className="">
                              <div className="font-bold">
                                {item.product.name} ({item.quantity})
                              </div>
                              <div className="text-sm text-app-secondary">
                                {item.product.Category.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-2">
                      <button
                        className="w-full bg-app-primary text-white rounded-md py-2 cursor-pointer"
                        onClick={() => {
                          router.push("/cart");
                        }}
                      >
                        Show Your Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
          <div className="cursor-pointer flex flex-row text-white">
            <Dropdown
              renderLabel={
                <div className="flex flex-row">
                  {" "}
                  <SVGAssets.FullnameIcon className="h-6 w-6 fill-app-white mr-2" />{" "}
                  <div className="sm:hidden md:block">
                    {userData?.name || "Hello"}
                  </div>
                </div>
              }
              id="profile-button"
            >
              {!!userData.name ? (
                <>
                  {" "}
                  <div
                    className="text-app-bg-primary text-center p-2 transition-all duration-200 hover:bg-app-bg-primary hover:text-app-white cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </div>
                  <div
                    className="text-app-danger text-center p-2 hover:bg-app-bg-primary hover:text-app-white cursor-pointer transition-all duration-200"
                    onClick={() => {
                      HandleLogout();
                    }}
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div
                    className="text-app-info text-center p-2 hover:bg-app-bg-primary hover:text-app-white cursor-pointer transition-all duration-200"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </div>
                </>
              )}
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
