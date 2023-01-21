export default {
  environment: process.env.NODE_ENV ?? "development",

  port: Number(process.env.PORT),

  jwtSecret: process.env.JWT_SECRET!,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) ?? 10,

  corsOrigins: process.env.CORS_ORIGINS?.split(","),

  prismaLogs: process.env.PRISMA_LOGS === "true",

  logtailToken: process.env.LOGTAIL_TOKEN!,
  enableRemoteLogging: process.env.ENABLE_REMOTE_LOGGING === "true",
};
