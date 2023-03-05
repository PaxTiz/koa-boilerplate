import { User } from "@prisma/client";
import { ResetPasswordInterface } from "../../api/user/types";
import config from "../../config";
import database from "../database";
import { send } from "../email";
import { hash } from "../security/bcrypt";
import { randomString } from "../security/random";

export default {
  safeUser(user: User) {
    return {
      ...user,
      password: undefined,
      resetPasswordToken: undefined,
      resetPasswordLastCheck: undefined,
    };
  },

  findByIdOrThrow(id: string) {
    return database.user.findUniqueOrThrow({
      where: { id },
      include: { role: true },
    });
  },

  async forgotPassword(email: string) {
    const user = await database.user.findFirst({
      where: { email },
    });

    if (user) {
      const resetPasswordToken = await this._getRandomPasswordToken();
      await database.user
        .update({
          data: { resetPasswordToken },
          where: { id: user.id },
        })
        .then(async (user) => {
          await send({
            template: "forgot_password",
            subject: "Reset your password",
            from: { email: config.defaultFromEmail },
            to: [{ name: user.username, email: user.email }],
            data: {
              fullname: user.username,
              url: `${config.webUrl}/auth/reset-password?token=${resetPasswordToken}`,
              duration: config.cron.resetPasswordDelay,
            },
          });
        });
    }

    return { message: "token_updated" };
  },

  async resetPassword(data: ResetPasswordInterface) {
    const user = await database.user.findFirst({
      where: { email: data.email, resetPasswordToken: data.token },
    });

    if (!user) {
      return null;
    }

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
          from: { email: config.defaultFromEmail },
          to: [{ name: user.username, email: user.email }],
          data: {
            fullname: user.username,
          },
        });

        return { message: "password_updated" };
      });
  },

  async _getRandomPasswordToken() {
    do {
      const token = randomString(64);
      const count = await database.user.count({
        where: { resetPasswordToken: token },
      });

      if (count === 0) {
        return token;
      }
    } while (true);
  },
};
