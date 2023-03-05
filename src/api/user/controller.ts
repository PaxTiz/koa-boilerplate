import { RouterContext } from "@koa/router";
import service from "../../core/services/user_service";
import { ServiceResponse } from "../controller";
import { ResetPasswordInterface } from "./types";

export default {
  async forgotPassword(context: RouterContext) {
    const email = context.request.body.email;
    const response = await service.forgotPassword(email);
    return ServiceResponse(context, response);
  },

  async resetPassword(context: RouterContext) {
    const body = context.request.body as ResetPasswordInterface;
    const response = await service.resetPassword(body);
    return ServiceResponse(context, response);
  },
};
