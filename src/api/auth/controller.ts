import { RouterContext } from "@koa/router";
import service from "../../core/services/auth_service";
import { ServiceResponse } from "../controller";
import { RegisterInterface } from "./types";

export default {
  me(context: RouterContext) {
    return ServiceResponse(context, context.state.user);
  },

  async login(context: RouterContext) {
    const { email, password } = context.request.body;
    const response = await service.login(email, password);
    return ServiceResponse(context, response);
  },

  async register(context: RouterContext) {
    const user = context.request.body as RegisterInterface;
    const response = await service.register(user);
    return ServiceResponse(context, response, 201);
  },
};
