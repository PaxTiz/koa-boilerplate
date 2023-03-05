import prompts from "prompts";
import database from "../../src/core/database";

export default {
  name: "create_user",
  description: "Insert a new user in the database",
  execute: async () => {
    const roles = await database.role.findMany();

    const response = await prompts.prompt([
      {
        type: "text",
        message: "Username",
        name: "username",
      },
      {
        type: "text",
        message: "Email",
        name: "email",
        validate(input: string) {
          return input.length >= 8 ? true : "email must be +8 characters";
        },
      },
      {
        type: "password",
        message: "Password",
        name: "password",
        validate(input: string) {
          return input.length >= 8 ? true : "password must be +8 characters";
        },
      },
      {
        type: "select",
        message: "Role",
        name: "role",
        choices: roles.map((role) => ({ title: role.name, value: role.id })),
      },
      {
        type: "confirm",
        name: "confirmation",
        message: "Confirm creation of this user ?",
      },
    ]);

    console.log(response);
  },
};
