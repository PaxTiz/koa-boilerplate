import { existsSync } from "fs";
import { rm } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import {
  absolutePath,
  getFileBuffer,
  getUploadDirectory,
  writeFileBuffer,
} from "./helpers";

type UploadImageInterface = {
  name: string;
  data: Buffer | string;
  directory: string | Array<string>;
  format?: "webp" | "png";
};

type UploadFileOptions = {
  name: string;
  data: Buffer | string;
  directory: string | Array<string>;
};

export const uploadImage = async (options: UploadImageInterface) => {
  const uploadedDirectory = await getUploadDirectory(options.directory);

  const imageName = `${options.name.toLowerCase()}.${options.format}`;
  const imageData = await getFileBuffer(options.data);

  let image = sharp(imageData);
  switch (options.format) {
    case "webp":
      image = await image.webp();
      break;
    case "png":
      image = await image.png();
      break;
  }

  const imageBuffer = await image.toBuffer();
  const imagePath = join(uploadedDirectory, imageName);
  return writeFileBuffer(imageBuffer, imagePath);
};

export const uploadFile = async (options: UploadFileOptions) => {
  const uploadedDirectory = await getUploadDirectory(options.directory);
  const fileName = options.name.toLowerCase();
  const fileData = (await getFileBuffer(options.data)) as Buffer;
  const filePath = join(uploadedDirectory, fileName);
  return writeFileBuffer(fileData, filePath);
};

export const remove = async (path: string) => {
  const fullPath = absolutePath(path);
  if (existsSync(fullPath)) {
    return rm(fullPath);
  }
};
