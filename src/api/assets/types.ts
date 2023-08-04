import { z } from "zod";
import { getFile } from "./middleware";

const getFileSchema = getFile.query.merge(getFile.params);

export type FindSingleAssetInterface = z.infer<typeof getFileSchema>;
