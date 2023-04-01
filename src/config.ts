/* eslint-disable @typescript-eslint/no-non-null-assertion */

export default {
  environment: process.env.NODE_ENV ?? "development",
  appKeys: process.env.APP_KEYS!.split(","),
  cookieDomain: process.env.COOKIE_DOMAIN,
  webUrl: process.env.WEB_URL!,

  port: Number(process.env.PORT),

  sibApiKey: process.env.SIB_API_KEY!,
  defaultFromEmail: process.env.EMAIL_DEFAULT_FROM!,

  jwtSecret: process.env.JWT_SECRET!,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) ?? 10,
  pbkdfSalt: process.env.PBKDF_SALT!,
  pbkdfIterationsCount: Number(process.env.PBKDF_ITERATIONS_COUNT) ?? 100000,

  corsOrigins: process.env.CORS_ORIGINS?.split(","),

  enablePrismaLogs: process.env.ENABLE_PRISMA_LOGS === "true",
  enableGlobalEmails: process.env.ENABLE_GLOBAL_EMAILS === "true",

  logtailToken: process.env.LOGTAIL_TOKEN!,
  enableRemoteLogging: process.env.ENABLE_REMOTE_LOGGING === "true",

  cron: {
    isEnabled: process.env.ENABLE_CRON === "true",
    enableTaskLogs: process.env.ENABLE_TASK_LOGS === "true",
    resetPasswordDelay: parseInt(process.env.CRON_RESET_PASSWORD_DELAY!),
    resetPasswordLinkDuration: parseInt(
      process.env.CRON_RESET_PASSWORD_LINK_DURATION!
    ),
  },
};
