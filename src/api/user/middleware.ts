import Joi from "joi";
import { validate } from "../middleware";

export default {
  forgotPassword: validate({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),

  resetPassword: validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      token: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
};
