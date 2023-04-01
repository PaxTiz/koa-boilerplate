import { RouterContext } from "@koa/router";
import service from "../../core/services/assets_service";
import { File } from "../controller";
import { FindSingleAssetInterface } from "./types";

export default {
  async getFile(context: RouterContext) {
    const options = {
      path: context.params.path,
      transformations: {
        format: context.query.format,
        width: context.query.width ? Number(context.query.width) : undefined,
        height: context.query.height ? Number(context.query.height) : undefined,
        quality: context.query.quality
          ? Number(context.query.quality)
          : undefined,
      },
    } as FindSingleAssetInterface;

    const file = await service.getFile(options);
    return File(context, { file, filename: options.path });
  },
};
