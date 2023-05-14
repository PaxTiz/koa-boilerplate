import { RouterContext } from "@koa/router";
import { isFormError } from "../../core/errors/form_error";
import { setCookie } from "../../core/security/jwt";
import service from "../../core/services/auth_service";
import { ServiceResponse } from "../controller";
import {
  LoginInterface,
  RegisterInterface,
  ResetPasswordInterface,
} from "./types";

export default {
  me(context: RouterContext) {
    return ServiceResponse(context, context.state.user);
  },

  async login(context: RouterContext) {
    const body = context.zod.body as LoginInterface;
    const response = await service.login(body);
    if (!isFormError(response)) {
      setCookie(context, response.token);
    }

    return ServiceResponse(context, response);
  },

  async register(context: RouterContext) {
    const user = context.zod.body as RegisterInterface;
    const response = await service.register(user);
    return ServiceResponse(context, response, 201);
  },

  async forgotPassword(context: RouterContext) {
    const email = context.zod.body.email;
    const response = await service.forgotPassword(email);
    return ServiceResponse(context, response);
  },

  async resetPassword(context: RouterContext) {
    const body = context.zod.body as ResetPasswordInterface;
    const response = await service.resetPassword(body);
    return ServiceResponse(context, response);
  },
};
