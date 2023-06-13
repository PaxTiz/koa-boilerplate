import { User } from "@prisma/client";
import dayjs from "dayjs";
import { UnauthenticatedException } from "../../api/controller";
import database from "../database";
import { compare } from "../security/bcrypt";

export default {
  safeUser(user: User) {
    return {
      ...user,
      password: undefined,
      resetPasswordToken: undefined,
      resetPasswordLastCheck: undefined,
      refreshTokens: undefined,
    };
  },

  findByIdOrThrow(id: string) {
    return database.user.findUniqueOrThrow({
      include: { role: true, refreshTokens: true },
      where: { id },
    });
  },

  async checkRefreshTokenValidity(userId: string, token: string) {
    const tokens = await database.refreshRoken.findMany({
      where: { userId },
    });

    const now = dayjs();
    for (const hash of tokens) {
      if (now > dayjs(hash.expiresAt)) {
        await database.refreshRoken.delete({
          where: { id: hash.id },
        });
        continue;
      }

      if (await compare(token, hash.token)) {
        return true;
      }
    }

    throw new UnauthenticatedException();
  },
};
