import { Context } from "koa";
import config from "../../config";

export const isValidOrigin = (context: Context) => {
  const origin = context.request.header.origin;
  if (!origin) {
    throw new Error("Origin not allowed");
  }

  if (config.app.corsOrigins.includes(origin)) {
    return origin;
  }

  return config.app.corsOrigins[0];
};
