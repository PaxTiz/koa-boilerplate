import { RouterContext } from "@koa/router";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import config from "../../config";

export const setCookie = (context: RouterContext, value: string) => {
  const url = new URL(context.origin);
  context.cookies.set("token", value, {
    domain: config.cookieDomain,
    secure: url.protocol === "https",
    httpOnly: url.protocol === "https",
    expires: dayjs().add(3, "hours").toDate(),
    signed: true,
  });
};

export const generate = (value: any, expiration = "3h") => {
  return jwt.sign(value, config.jwtSecret, { expiresIn: expiration });
};

export const verify = (token: string): unknown => {
  return jwt.verify(token, config.jwtSecret, (err, data) => {
    if (err) {
      throw err;
    }

    return data;
  });
};
