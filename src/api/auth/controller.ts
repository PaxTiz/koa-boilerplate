import { RouterContext } from "@koa/router";
import config from "../../config";
import { isFormError } from "../../core/errors/form_error";
import { parseRequest } from "../../core/requests/parse_request";
import { setCookie } from "../../core/security/jwt";
import service from "../../core/services/auth_service";
import { ServiceResponse } from "../controller";
import {
  ForgotPassword,
  LoginInterface,
  RegisterInterface,
  ResetPasswordInterface,
} from "./types";

export default {
  me(context: RouterContext) {
    return ServiceResponse(context, context.state.user);
  },

  async login(context: RouterContext) {
    const body = parseRequest<LoginInterface>(context);
    const response = await service.login(body);
    if (!isFormError(response)) {
      attachTokens(context, response);
    }

    return ServiceResponse(context, response);
  },

  async register(context: RouterContext) {
    const user = parseRequest<RegisterInterface>(context);
    const response = await service.register(user);
    return ServiceResponse(context, response, 201);
  },

  async forgotPassword(context: RouterContext) {
    const body = parseRequest<ForgotPassword>(context);
    const response = await service.forgotPassword(body);
    return ServiceResponse(context, response);
  },

  async resetPassword(context: RouterContext) {
    const body = parseRequest<ResetPasswordInterface>(context);
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
