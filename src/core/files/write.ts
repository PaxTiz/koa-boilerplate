import { File } from "formidable";
import { existsSync } from "fs";
import { copyFile, rm } from "fs/promises";
import { join } from "path";
import { randomString } from "../security/random";
import { absolutePath, getUploadDirectory } from "./helpers";

type UploadImageInterface = {
  file: File;
  directory: string;
  filename?: string;
};

export const uploadFile = async (options: UploadImageInterface) => {
  const uploadsDirectory = await getUploadDirectory(options.directory);
  const imagePath = join(uploadsDirectory, getFilename(options));
  await copyFile(options.file.filepath, imagePath);
  return "/upload" + imagePath.split("/upload")[1];
};

export const remove = async (path: string) => {
  const fullPath = absolutePath(path);
  if (existsSync(fullPath)) {
    return rm(fullPath);
  }
};

const getFilename = (options: UploadImageInterface) => {
  return options.filename ?? options.file.originalFilename ?? randomString(8);
};
