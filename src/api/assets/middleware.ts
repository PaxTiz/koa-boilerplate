import { z } from "zod";
import { validate } from "../middleware";

export const getFile = {
  params: z.object({
    path: z.string(),
  }),
  query: z.object({
    width: z.coerce.number().positive().optional(),
    height: z.coerce.number().positive().optional(),
    format: z.enum(["png", "jpeg", "webp"]).optional(),
    quality: z.coerce.number().positive().max(100).optional(),
  }),
};

export default {
  getFile: validate(getFile),
};
