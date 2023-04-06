import { readdir } from "fs/promises";
import Koa from "koa";
import { join } from "path";

export default async (app: Koa) => {
  const self = await readdir(__dirname);
  for (const entity of self) {
    if (!entity.endsWith(".ts")) {
      console.log(`🔥 Mount router /${entity}`);
      const router = await import(join(__dirname, entity, "router.ts"));
      app.use(router.default.routes()).use(router.default.allowedMethods());
    }
  }
};
