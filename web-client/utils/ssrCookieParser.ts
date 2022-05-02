import { NextPageContext } from "next";

const ParseSSRCookie = (ctx: NextPageContext, key: string) => {
  let value = "";
  const parsedCookie = (ctx?.req?.headers.cookie || "")
    .split(";")
    .filter((item: string) => item.includes(key));

  if (parsedCookie.length > 0) {
    value = parsedCookie[0].replace(`${key}=`, "");
  }

  return value;
};

export default ParseSSRCookie;
