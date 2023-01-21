import { RegisterInterface } from "../../api/auth/types";
import database from "../database";
import FormError from "../errors/form_error";
import { compare, hash } from "../security/bcrypt";
import { generate } from "../security/jwt";

export default {
  async login(email: string, password: string) {
    const user = await database.user.findFirst({
      where: { email },
    });

    if (!user || !compare(password, user.password)) {
      return new FormError("email", "invalid_credentials");
    }

    return {
      token: generate({ id: user.id }),
    };
  },

  async register(user: RegisterInterface) {
    const errors = [];

    const usernameExists = await database.user.findFirst({
      where: { username: user.username },
    });
    if (usernameExists) {
      errors.push(new FormError("username", "username_already_exists"));
    }

    const emailExists = await database.user.findFirst({
      where: { email: user.email },
    });
    if (emailExists) {
      errors.push(new FormError("email", "email_already_exists"));
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
      .then((inserted) => ({
        token: generate({ id: inserted.id }),
      }));
  },
};
