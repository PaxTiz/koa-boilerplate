import { z } from "zod";
import { getFile } from "./middleware";

export type FileTransformationsInterface = z.infer<typeof getFile.query>;

export type FindSingleAssetInterface = z.infer<typeof getFile.params> &
  FileTransformationsInterface;
