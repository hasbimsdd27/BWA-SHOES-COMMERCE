import cookie from "cookie";
import { Cookies } from "react-cookie";
import { NextPageContext } from "next";

const cookies = new Cookies();

export const parseCookies = ({ req }: NextPageContext) => {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
};

export const setCookie = (
  cookieName: string,
  cookieValue: string,
  cookieAge: number = 1000 * 60 * 60 * 24 * 365 * 10
) => {
  cookies.set(cookieName, cookieValue, { maxAge: cookieAge });
};

export const getCookie = (cookieName: string) => cookies.get(cookieName);

export const removeCookie = (cookieName: string) => {
  cookies.remove(cookieName);
};

export const deleteAllCookies = () => {
  let cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};
