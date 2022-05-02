import React from "react";
import Navbar from "../navbar";

interface IPropsLayout {
  children: JSX.Element;
}

const Layout = ({ children }: IPropsLayout) => {
  return (
    <>
      <div className="min-h-screen w-screen bg-app-bg-primary font-poppins flex items-center flex-col overflow-x-hidden">
        <Navbar />
        <div className="max-w-screen-2xl w-full py-4 sm:px-4 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
};

Layout.defaultProps = {
  children: <></>,
};

export default Layout;
