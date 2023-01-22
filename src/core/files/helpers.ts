import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { readFile } from "./read";

const baseDirectory = join(__dirname, "..", "..", "..");

export const absolutePath = (path: string) => {
  return join(baseDirectory, "upload", path);
};

export const getUploadDirectory = async (directory: string | Array<string>) => {
  const directoryPath = Array.isArray(directory)
    ? join(...directory)
    : directory;
  const fullPath = absolutePath(directoryPath);

  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }

  return fullPath;
};

export const getFileBuffer = (data: Buffer | string) => {
  return Buffer.isBuffer(data) ? data : readFile(data);
};

export const writeFileBuffer = async (buffer: Buffer, path: string) => {
  await writeFile(path, buffer);
  const filePath = path.split("/upload/")[1];
  return `/upload/${filePath}`;
};
