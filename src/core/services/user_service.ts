import { User } from "@prisma/client";
import database from "../database";

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
};
