import { User } from "@prisma/client";
import { readdirSync } from "fs";
import { join } from "path";
import { ForbiddenException } from "../../api/controller";
import { Permission, Permissions } from "./types";

const _permissions: Permissions = {};

export const definePermissionGroup = (permissions: Permissions) => permissions;

export const setupPermissions = async () => {
  const files = readdirSync(join(__dirname, "permissions"));
  for (const file of files) {
    const methods = await import(join(__dirname, "permissions", file));
    const permissions = methods.default;
    for (const [name, permission] of Object.entries(permissions)) {
      if (_permissions[name]) {
        throw new Error(`Permission '${name} is already defined'`);
      }

      _permissions[name] = permission as Permission;
    }
  }
};

export const can = (
  key: string,
  user: User,
  ...other: any
): Promise<boolean> => {
  const permission = _permissions[key];
  if (!permission) {
    throw new Error(`Permission '${key}' was not found'`);
  }

  return permission(user, ...other);
};

export const assert = async (key: string, user: User, ...other: any) => {
  const response = await can(key, user, other);
  if (!response) {
    throw new ForbiddenException();
  }
};
