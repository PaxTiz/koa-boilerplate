import Joi from "joi";
import { validate } from "../middleware";

export default {
  login: validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).required(),
  }),

  register: validate({
    body: Joi.object({
      username: Joi.string().min(8),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
};
