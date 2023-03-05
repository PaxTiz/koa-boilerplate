import crypto from "crypto";

export const randomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};
