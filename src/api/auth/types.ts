import { z } from "zod";
import { forgotPassword, login, register, resetPassword } from "./middleware";

export type LoginInterface = z.infer<typeof login.body>;

export type RegisterInterface = z.infer<typeof register.body>;

export type ForgotPassword = z.infer<typeof forgotPassword.body>;

export type ResetPasswordInterface = z.infer<typeof resetPassword.body>;
