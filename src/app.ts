import dotenv from "dotenv";
dotenv.config();

import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-body";
import compress from "koa-compress";
import helmet from "koa-helmet";
import morgan from "koa-morgan";
import config from "./config";
import errorHandler from "./core/errors/error_handler";

import setupRouters from "./api/router";
import { setupPermissions } from "./core/authorization";
import setupCron from "./core/cron";
import { isValidOrigin } from "./core/security/cors";
import { setupBetterConsole, setupLogger } from "./logger";

const main = async () => {
  setupBetterConsole();
  setupLogger();
  await setupCron();
  await setupPermissions();

  const app = new Koa();
  app.keys = config.app.keys;

  app.use(errorHandler);

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compress());
  app.use(bodyParser({ multipart: true }));
  app.use(
    cors({
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"],
      origin: isValidOrigin,
    })
  );

  await setupRouters(app);

  app.listen(config.app.port);
  console.log(`🚀 Server started on port ${config.app.port}`);
};

main();
