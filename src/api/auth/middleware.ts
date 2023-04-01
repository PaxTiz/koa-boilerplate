import z from "zod";
import { isAuthenticated, validate } from "../middleware";

export default {
  me: validate({
    before: [isAuthenticated],
  }),

  login: validate({
    body: z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .strict(),
  }),

  register: validate({
    body: z
      .object({
        username: z.string().min(8),
        email: z.string().email(),
        password: z.string().min(8),
      })
      .strict(),
  }),

  forgotPassword: validate({
    body: z
      .object({
        email: z.string().email(),
      })
      .strict(),
  }),

  resetPassword: validate({
    body: z
      .object({
        email: z.string().email(),
        token: z.string(),
        password: z.string().min(8),
      })
      .strict(),
  }),
};
