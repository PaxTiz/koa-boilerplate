import { RouterContext } from "@koa/router";

export const parseRequest = <T>(context: RouterContext) => {
  return {
    ...context.zod.body,
    ...context.zod.query,
    ...context.zod.params,
  } as T;
};
