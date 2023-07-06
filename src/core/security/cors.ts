import { Context } from "koa";
import config from "../../config";

export const isValidOrigin = (context: Context) => {
  const origin = context.request.header.origin;
  if (!origin) {
    throw new Error("Origin not allowed");
  }

  const domain = new URL(origin).hostname;
  if (config.app.corsOrigins.includes(domain)) {
    return origin;
  }

  return config.app.corsOrigins[0];
};
