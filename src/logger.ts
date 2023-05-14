import { createConsola } from "consola";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import pino, { StreamEntry } from "pino";
import pretty from "pino-pretty";
import config from "./config";

const logsDirectory = join(__dirname, "..", "logs");

export const setupBetterConsole = () => {
  if (config.environment !== "development") {
    // Keep default console on non-dev environments
    return;
  }

  createConsola().wrapAll();
};

export const setupLogger = () => {
  if (!existsSync(logsDirectory)) {
    mkdirSync(logsDirectory, { recursive: true });
  }
};

export const useLogger = (service: string) => {
  const streams: Array<StreamEntry> = [
    {
      level: "trace",
      stream: pretty({
        destination: createWriteStream(join(logsDirectory, "all")),
      }),
    },
    {
      level: "error",
      stream: pretty({
        destination: createWriteStream(join(logsDirectory, "error")),
      }),
    },
  ];

  if (config.environment === "development") {
    streams.push({
      stream: pretty(),
      level: "trace",
    });
  }

  return pino({ level: "trace" }, pino.multistream(streams)).child({ service });
};
