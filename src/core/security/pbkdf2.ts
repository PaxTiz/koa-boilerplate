import { pbkdf2Sync } from "crypto";
import config from "../../config";

export const generate = (value: string) => {
  const result = pbkdf2Sync(
    Buffer.from(value, "hex"),
    config.pbkdfSalt,
    config.pbkdfIterationsCount,
    32,
    "sha512"
  );
  return result.toString("hex");
};

export const verify = (value: string, hash: string) => {
  const valueHash = pbkdf2Sync(
    Buffer.from(value, "hex"),
    config.pbkdfSalt,
    config.pbkdfIterationsCount,
    32,
    "sha512"
  ).toString("hex");

  return valueHash === hash;
};
