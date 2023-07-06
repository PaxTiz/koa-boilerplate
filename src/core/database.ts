import { PrismaClient } from "@prisma/client";
import config from "../config";

const client = new PrismaClient({
  log: config.database.enablePrismaLogs
    ? ["error", "info", "query", "warn"]
    : [],
});

export default client;
