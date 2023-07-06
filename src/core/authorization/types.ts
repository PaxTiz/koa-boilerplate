import { User } from "@prisma/client";

export type Permission = (user: User, ...other: any) => Promise<boolean>;

export type Permissions = Record<string, Permission>;

export type PermissionGroup = () => Permissions;
