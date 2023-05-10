import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";

const baseDirectory = join(__dirname, "..", "..", "..");

export const absolutePath = (path: string) => {
  return join(baseDirectory, "upload", path);
};

export const getUploadDirectory = async (directory: string) => {
  const fullPath = absolutePath(directory);
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }

  return fullPath;
};
