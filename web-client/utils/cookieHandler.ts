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
