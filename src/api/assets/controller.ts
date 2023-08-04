import { RouterContext } from "@koa/router";
import { parseRequest } from "../../core/requests/parse_request";
import service from "../../core/services/assets_service";
import { File } from "../controller";
import { FindSingleAssetInterface } from "./types";

export default {
  async getFile(context: RouterContext) {
    const options = parseRequest<FindSingleAssetInterface>(context);
    const file = await service.getFile(options);
    return File(context, { file, filename: options.path });
  },
};
