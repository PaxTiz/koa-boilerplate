import Joi from "joi";
import { validate } from "../middleware";

export default {
  getFile: validate({
    params: Joi.object({
      path: Joi.string().required(),
    }),
    query: Joi.object({
      width: Joi.number().positive().optional(),
      height: Joi.number().positive().optional(),
      format: Joi.string().allow("png", "jpeg", "webp").optional(),
      quality: Joi.number().positive().max(100).optional(),
    }),
  }),
};
