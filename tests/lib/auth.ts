import client from "../../src/core/database";
import { hash } from "../../src/core/security/bcrypt";

const FAKE_USER = {
  email: "test@email.com",
  password: "my-amazing-password",
};

export const createFakeUser = async () => {
  const role = await client.role.findFirst({ where: { name: "default" } });
  await client.user.create({
    data: {
      email: FAKE_USER.email,
      password: await hash(FAKE_USER.password),
      username: "John Doe",
      roleId: role!.id,
    },
  });

  return FAKE_USER;
};

export const deleteFakeUser = async () => {
  await client.user.deleteMany({
    where: { email: FAKE_USER.email },
  });
};
