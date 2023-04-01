import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import sharp, { Sharp } from "sharp";
import {
  FileTransformationsInterface,
  FindSingleAssetInterface,
} from "../../api/assets/types";
import { NotFoundException } from "../../api/controller";

const publicPath = join(__dirname, "..", "..", "..", "upload", "public");

export default {
  async getFile(options: FindSingleAssetInterface) {
    const file = await this._readFile(options.path);
    const buffer = sharp(file, { limitInputPixels: false });
    if (await this._canApplyTransformations(buffer)) {
      return this._applyTransformations(buffer, options.transformations);
    }

    return file;
  },

  _readFile(path: string) {
    const filePath = join(publicPath, path);
    if (!existsSync(filePath)) {
      throw new NotFoundException();
    }

    return readFile(filePath);
  },

  async _canApplyTransformations(data: Sharp) {
    const metadata = await data.metadata();
    if (!metadata.format) {
      return false;
    }

    return ["png", "webp", "gif", "jpg", "jpeg"].includes(metadata.format);
  },

  async _applyTransformations(
    data: Sharp,
    transformations: FileTransformationsInterface
  ) {
    try {
      if (transformations.format) {
        data = data.toFormat(transformations.format, {
          quality: transformations.quality,
        });
      }

      if (transformations.width || transformations.height) {
        data = data.resize(transformations.width, transformations.height);
      }
    } finally {
      return data.toBuffer();
    }
  },
};
