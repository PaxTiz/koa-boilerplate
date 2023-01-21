import jwt from "jsonwebtoken";
import config from "../../config";

export const generate = (value: any, expiration = "3h") => {
  return jwt.sign(value, config.jwtSecret, { expiresIn: expiration });
};

export const verify = (token: string): unknown => {
  return jwt.verify(token, config.jwtSecret, (err, data) => {
    if (err) {
      throw err;
    }

    return data;
  });
};
