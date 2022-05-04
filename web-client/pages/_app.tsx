import "../styles/globals.css";
import type { AppProps } from "next/app";
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { Store } from "../redux/reducer/rootReducer";
import { getCookie } from "../utils/cookieHandler";
import { getUserProfile } from "../service/auth";
import { getCartData } from "../service/cart";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    if (!!getCookie("access_token")) {
      getUserProfile();
      getCartData();
    }

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);
  return (
    <Provider store={Store}>
      <div className="overflow-x-hidden">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
