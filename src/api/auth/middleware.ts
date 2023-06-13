import { z } from "zod";
import { hasRefreshToken, isAuthenticated, validate } from "../middleware";

export const login = {
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
};

export const register = {
  body: z.object({
    username: z.string().min(8),
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

export const forgotPassword = {
  body: z.object({
    email: z.string().email(),
  }),
};

export const resetPassword = {
  body: z.object({
    token: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

export const refreshToken = {
  before: [hasRefreshToken],
};

export default {
  me: validate({
    before: [isAuthenticated],
  }),

  login: validate(login),

  register: validate(register),

  forgotPassword: validate(forgotPassword),

  resetPassword: validate(resetPassword),

  refreshToken: validate(refreshToken),
};
