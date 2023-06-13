import { RouterContext } from "@koa/router";
import config from "../../config";
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
      attachTokens(context, response);
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

  async refreshToken(context: RouterContext) {
    const response = await service.refreshAuthenticationTokens(
      context.state.user
    );

    attachTokens(context, response);
    return ServiceResponse(context, response);
  },
};

const attachTokens = (
  context: RouterContext,
  tokens: { accessToken: string; refreshToken: string }
) => {
  setCookie(context, {
    value: tokens.accessToken,
    cookie: config.jwt.accessToken.cookie,
    expiration: config.jwt.accessToken.expirationAsDate,
  });
  setCookie(context, {
    value: tokens.refreshToken,
    cookie: config.jwt.refreshToken.cookie,
    expiration: config.jwt.refreshToken.expirationAsDate,
  });
};
