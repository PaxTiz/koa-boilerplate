import { readFile as fsReadFile } from "fs/promises";
import { join } from "path";

type ReadFileInterface = {
  utf8?: boolean;
};

export const readFile = (
  path: string,
  options: ReadFileInterface = { utf8: false }
) => {
  const filePath = join(__dirname, "..", "..", "..", path);
  return fsReadFile(filePath, { encoding: options.utf8 ? "utf-8" : undefined });
};
