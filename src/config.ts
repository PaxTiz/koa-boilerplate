/* eslint-disable @typescript-eslint/no-non-null-assertion */

export default {
  environment: process.env.NODE_ENV ?? "development",
  appKeys: process.env.APP_KEYS!.split(","),
  cookieDomain: process.env.COOKIE_DOMAIN,

  port: Number(process.env.PORT),

  jwtSecret: process.env.JWT_SECRET!,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) ?? 10,
  pbkdfSalt: process.env.PBKDF_SALT!,
  pbkdfIterationsCount: Number(process.env.PBKDF_ITERATIONS_COUNT) ?? 100000,

  corsOrigins: process.env.CORS_ORIGINS?.split(","),

  prismaLogs: process.env.PRISMA_LOGS === "true",

  logtailToken: process.env.LOGTAIL_TOKEN!,
  enableRemoteLogging: process.env.ENABLE_REMOTE_LOGGING === "true",

  cron: {
    resetPasswordDelay: parseInt(process.env.CRON_RESET_PASSWORD_DELAY!),
  },
};
