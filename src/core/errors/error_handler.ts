import { Prisma } from "@prisma/client";
import { Context, Next } from "koa";
import {
  Forbidden,
  ForbiddenException,
  InternalServerError,
  NotFound,
  NotFoundException,
  Unauthenticated,
  UnauthenticatedException,
} from "../../api/controller";
import config from "../../config";
import logger from "../../logger";

export default async (context: Context, next: Next) => {
  try {
    await next();

    if (config.enableRemoteLogging) {
      logger.info(`OK: ${context.response.status}`);
    }
  } catch (err) {
    console.error(err);
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

    if (err instanceof UnauthenticatedException) {
      return Unauthenticated(context);
    }
    if (err instanceof ForbiddenException) {
      return Forbidden(context);
    }
    if (err instanceof NotFoundException) {
      return NotFound(context);
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NotFound(context);
    }

    return InternalServerError(context);
  }
};
