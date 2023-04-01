export type FileTransformationsInterface = {
  width?: number;
  height?: number;
  format?: "webp" | "png" | "jpeg";
  quality?: number;
};

export type FindSingleAssetInterface = {
  path: string;
  transformations: FileTransformationsInterface;
};
