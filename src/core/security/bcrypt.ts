import bcrypt from "bcrypt";
import config from "../../config";

export const hash = async (value: any) => {
  const salt = await bcrypt.genSalt(config.security.bcrypt.saltRounds);
  return bcrypt.hash(value, salt);
};

export const compare = (value: any, hash: string) => {
  return bcrypt.compare(value, hash);
};
