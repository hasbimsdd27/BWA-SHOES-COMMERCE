import { NextPage } from "next";
import React from "react";
import Navbar from "../navbar";

interface IPropsLayout {
  children: JSX.Element;
}

const Layout = ({ children }: IPropsLayout) => {
  return (
    <div className="min-h-screen w-screen bg-app-bg-primary flex flex-col items-center">
      <Navbar />
      <div className="max-w-screen-2xl w-full py-4 px-8">{children}</div>
    </div>
  );
};

Layout.defaultProps = {
  children: <></>,
};

export default Layout;
