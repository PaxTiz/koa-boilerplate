import { PrismaClient } from "@prisma/client";
import config from "../config";

const client = new PrismaClient({
  log: config.prismaLogs ? ["error", "info", "query", "warn"] : [],
});

export default client;
