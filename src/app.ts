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
import setupCron from "./core/cron";
import { setupBetterConsole, setupLogger } from "./logger";

const main = async () => {
  setupBetterConsole();
  setupLogger();
  await setupCron();

  const app = new Koa();
  app.keys = config.appKeys;

  app.use(errorHandler);

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compress());
  app.use(bodyParser({ multipart: true }));
  app.use(
    cors({
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"],
      origin(context) {
        const header = context.headers.origin;
        if (!header) {
          return "localhost";
        }

        if (config.corsOrigins?.includes(header)) {
          return header;
        }

        throw new Error("Origin not allowed");
      },
    })
  );

  await setupRouters(app);

  app.listen(config.port);
  console.log(`🚀 Server started on port ${config.port}`);
};

main();
