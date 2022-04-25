import { NextPage } from "next";
import React, { useState } from "react";
import SVGAssets from "../../assets/svg";

const Navbar = () => {
  const [focus, setFocus] = useState({
    searchInput: false,
  });
  return (
    <div className="w-screen flex flex-row items-center justify-center">
      <div className="max-w-screen-2xl w-full flex flex-row p-4">
        <div className="lg:px-4 sm:px-2 flex flex-row items-center justify-center">
          <SVGAssets.MainLogoIcon className="h-8 w-8 mr-4" />
          <div className="text-white sm:hidden md:block">
            <div>Shoes</div>
            <div>Commerce</div>
          </div>
        </div>
        <div className="flex flex-1 lg:px-12 sm:px-2">
          <div
            className={`w-full h-full justify-center items-center flex flex-row border px-4 rounded-md transition-all duration-200 ${
              focus.searchInput ? "border-app-primary" : "border-app-secondary"
            }`}
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
              />
            </div>
            <div>
              <SVGAssets.SearchIcon
                className={`h-4 w-4 transition-all duration-200 ${
                  focus.searchInput ? "fill-app-primary" : "fill-app-secondary"
                } `}
              />
            </div>
          </div>
        </div>
        <div className="lg:px-4 sm:px-2 flex flex-row items-center justify-center">
          <div className="mr-4 cursor-pointer">
            <SVGAssets.CartIcon className="h-6 w-6" />
          </div>
          <div className="cursor-pointer flex flex-row text-white">
            <SVGAssets.FullnameIcon className="h-6 w-6 fill-app-white mr-2" />{" "}
            <div className="sm:hidden md:block">Hello</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
