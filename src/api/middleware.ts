import { RouterContext } from "@koa/router";
import { Schema } from "joi";
import { Context } from "koa";
import FormError from "../core/errors/form_error";
import { verify } from "../core/security/jwt";
import userService from "../core/services/user_service";
import { Unauthenticated } from "./controller";

export const isAuthenticated = async (
  context: RouterContext,
  next: Function
) => {
  const authorizationHeader = context.headers.authorization;
  if (!authorizationHeader) {
    return Unauthenticated(context);
  }

  const [bearer, token] = authorizationHeader.split(" ");
  if (!bearer || !token) {
    return Unauthenticated(context);
  }

  try {
    const decodedToken = verify(token) as { id: string };
    const user = await userService.findByIdOrThrow(decodedToken.id);
    context.state.user = userService.safeUser(user);
  } catch {
    return Unauthenticated(context);
  }

  return next();
};

type ValidateSchema = {
  body?: Schema;
  params?: Schema;
  query?: Schema;
};

const formatErrors = (errors: Record<string, any>) => {
  return errors.details.map(
    (error: any) => new FormError(error.context.key, error.message)
  );
};

const validateSchema = (schema: Schema, object: any): Array<FormError> => {
  const errors = schema.validate(object, {
    abortEarly: false,
  });

  return errors.error ? formatErrors(errors.error) : [];
};

export const validate = (schemas: ValidateSchema) => {
  return (context: RouterContext & Context, next: Function) => {
    let allErrors: Array<FormError> = [];

    if (schemas.body) {
      allErrors = [
        ...allErrors,
        ...validateSchema(schemas.body, context.request.body),
      ];
    }

    if (schemas.params) {
      allErrors = [
        ...allErrors,
        ...validateSchema(schemas.params, context.params),
      ];
    }

    if (schemas.query) {
      allErrors = [
        ...allErrors,
        ...validateSchema(schemas.query, context.request.query),
      ];
    }

    if (allErrors.length) {
      context.response.body = allErrors;
      context.response.status = 400;
      return context;
    }

    return next();
  };
};
