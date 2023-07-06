import { User } from "@prisma/client";
import { hash as ohash } from "ohash";
import {
  LoginInterface,
  RegisterInterface,
  ResetPasswordInterface,
} from "../../api/auth/types";
import config from "../../config";
import database from "../database";
import { send } from "../email";
import { createFormError } from "../errors/form_error";
import { compare, hash } from "../security/bcrypt";
import { generate } from "../security/jwt";

export default {
  async refreshAuthenticationTokens(user: User) {
    const refreshToken = generate(
      { id: user.id, tokenType: "refreshToken" },
      config.jwt.refreshToken.expiration
    );

    await database.refreshToken.create({
      data: {
        userId: user.id,
        token: await hash(refreshToken),
        expiresAt: config.jwt.refreshToken.expirationAsDate,
      },
    });
    return {
      accessToken: generate(
        { id: user.id, tokenType: "accessToken" },
        config.jwt.accessToken.expiration
      ),
      refreshToken,
    };
  },

  async login(login: LoginInterface) {
    const user = await database.user.findFirst({
      where: { email: login.email },
    });

    if (!user || !(await compare(login.password, user.password))) {
      return createFormError("email", "invalid_credentials");
    }

    return this.refreshAuthenticationTokens(user);
  },

  async register(user: RegisterInterface) {
    const errors = [];

    const usernameExists = await database.user.count({
      where: { username: user.username },
    });
    if (usernameExists) {
      errors.push(createFormError("username", "username_already_exists"));
    }

    const emailExists = await database.user.count({
      where: { email: user.email },
    });
    if (emailExists) {
      errors.push(createFormError("email", "email_already_exists"));
    }

    if (errors.length) {
      return errors;
    }

    const role = await database.role.findFirstOrThrow({
      where: { name: "default" },
    });
    return database.user
      .create({
        include: { role: true },
        data: {
          username: user.username,
          email: user.email,
          password: await hash(user.password),
          roleId: role.id,
        },
      })
      .then(() => ({ message: "user_created" }));
  },

  async forgotPassword(email: string) {
    const user = await database.user.findFirst({
      where: { email },
    });

    if (user) {
      const resetPasswordToken = ohash({ email: user.email });
      await database.user
        .update({
          data: { resetPasswordToken },
          where: { id: user.id },
        })
        .then(async (user) => {
          await send({
            template: "forgot_password",
            subject: "Reset your password",
            to: [{ name: user.username, email: user.email }],
            data: {
              fullname: user.username,
              url: `${config.app.webUrl}/auth/reset-password?token=${resetPasswordToken}`,
              duration: config.cron.resetPasswordLinkDuration,
            },
          });
        });
    }

    return { message: "token_updated" };
  },

  async resetPassword(data: ResetPasswordInterface) {
    const user = await database.user.findFirstOrThrow({
      where: { email: data.email, resetPasswordToken: data.token },
    });

    return database.user
      .update({
        where: { id: user.id },
        data: {
          password: await hash(data.password),
          resetPasswordToken: null,
          resetPasswordLastCheck: null,
        },
      })
      .then(async () => {
        await send({
          template: "reset_password",
          subject: "Your password has been updated",
          from: { email: config.email.defaultFrom },
          to: [{ name: user.username, email: user.email }],
          data: {
            fullname: user.username,
          },
        });

        return { message: "password_updated" };
      });
  },
};
