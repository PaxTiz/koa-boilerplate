import { RouterContext } from "@koa/router";
import jwt from "jsonwebtoken";
import config from "../../config";

interface SetCookieInterface {
  value: string;
  cookie: string;
  expiration: Date;
}

export const setCookie = (
  context: RouterContext,
  options: SetCookieInterface
) => {
  const url = new URL(context.origin);
  context.cookies.set(options.cookie, options.value, {
    domain: config.app.cookieDomain,
    secure: url.protocol === "https",
    httpOnly: url.protocol === "https",
    expires: options.expiration,
    signed: true,
  });
};

export const generate = (value: any, expiration = "3h") => {
  return jwt.sign(value, config.jwt.secret, { expiresIn: expiration });
};

export const verify = (token: string): unknown => {
  return jwt.verify(token, config.jwt.secret, (err, data) => {
    if (err) {
      throw err;
    }

    return data;
  });
};
