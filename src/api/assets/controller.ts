import { RouterContext } from "@koa/router";
import service from "../../core/services/assets_service";
import { File } from "../controller";
import { FindSingleAssetInterface } from "./types";

export default {
  async getFile(context: RouterContext) {
    const options = {
      path: context.zod.params.path,
      transformations: context.zod.query,
    } as FindSingleAssetInterface;

    const file = await service.getFile(options);
    return File(context, { file, filename: options.path });
  },
};
