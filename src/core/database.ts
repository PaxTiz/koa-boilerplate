import { PrismaClient } from "@prisma/client";
import config from "../config";

const client = new PrismaClient({
  log: config.enablePrismaLogs ? ["error", "info", "query", "warn"] : [],
});

export default client;
