import { Context, Next } from "koa";
import { InternalServerError } from "../../api/controller";
import config from "../../config";
import logger from "../../logger";

export default async (context: Context, next: Next) => {
  try {
    await next();
    logger.info(`OK: ${context.response.status}`);
  } catch (err) {
    if (config.enableRemoteLogging) {
      const userInfo = context.state.user
        ? {
            id: context.state.user.id,
            email: context.state.user.email,
            role: context.state.user.role.name,
          }
        : null;
      logger.error((err as Error) ?? "Internal Server Error", {
        user: userInfo,
      });
    }

    return InternalServerError(context);
  }
};
