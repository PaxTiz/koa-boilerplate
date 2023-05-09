import { z } from "zod";
import { login, register, resetPassword } from "./middleware";

export type LoginInterface = z.infer<typeof login.body>;

export type RegisterInterface = z.infer<typeof register.body>;

export type ResetPasswordInterface = z.infer<typeof resetPassword.body>;
