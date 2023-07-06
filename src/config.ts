/* eslint-disable @typescript-eslint/no-non-null-assertion */

import dayjs from "dayjs";

export default {
  app: {
    environment: process.env.NODE_ENV ?? "development",
    keys: process.env.APP_KEYS!.split(","),
    cookieDomain: process.env.COOKIE_DOMAIN,
    webUrl: process.env.WEB_URL!,
    port: Number(process.env.PORT),
    corsOrigins: process.env.CORS_ORIGINS?.split(",") ?? ["localhost"],
  },

  database: {
    enablePrismaLogs: process.env.ENABLE_PRISMA_LOGS === "true",
  },

  email: {
    apiKey: process.env.SIB_API_KEY!,
    defaultFrom: process.env.EMAIL_DEFAULT_FROM!,
    enabled: process.env.ENABLE_GLOBAL_EMAILS === "true",
  },

  security: {
    bcrypt: {
      saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) ?? 10,
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET!,

    accessToken: {
      cookie: "accessToken",
      expiration: "1min",
      expirationAsDate: dayjs().add(1, "minutes").toDate(),
    },
    refreshToken: {
      cookie: "refreshToken",
      expiration: "30d",
      expirationAsDate: dayjs().add(30, "days").toDate(),
    },
  },

  cron: {
    isEnabled: process.env.ENABLE_CRON === "true",
    enableTaskLogs: process.env.ENABLE_TASK_LOGS === "true",
    resetPasswordDelay: parseInt(process.env.CRON_RESET_PASSWORD_DELAY!),
    resetPasswordLinkDuration: parseInt(
      process.env.CRON_RESET_PASSWORD_LINK_DURATION!
    ),
  },
};
