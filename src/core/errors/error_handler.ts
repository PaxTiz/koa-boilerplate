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
import { logger } from "../../logger";

const _logger = logger("api");

export default async (context: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof UnauthenticatedException) {
      return Unauthenticated(context);
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

    /**
     * Logs error only if it's a `real` error
     *  - 401 are because a JWT Token is invalid
     *  - 404 are because something was not found
     *
     *  - 403 means someone tries to do something he's not supposed to
     *  - 500 means the somerhing on the server is broken
     */
    _logger.error(err);

    if (err instanceof ForbiddenException) {
      return Forbidden(context);
    }

    return InternalServerError(context);
  }
};
