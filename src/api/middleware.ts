import { RouterContext } from "@koa/router";
import { Schema } from "joi";
import { Context, Next } from "koa";
import FormError from "../core/errors/form_error";
import { verify } from "../core/security/jwt";
import userService from "../core/services/user_service";
import { Unauthenticated } from "./controller";

export const isAuthenticated = async (context: RouterContext, next: Next) => {
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

type FileValidator = {
  /** Maximum size of file in bytes */
  size?: number;

  /** List of allowed mime types */
  mimeTypes?: string | Array<string> | ((mimeType: string) => string | null);

  /** Mark the file as required, send error if not provided */
  required?: boolean;
};
type ValidateSchema = {
  body?: Schema;
  params?: Schema;
  query?: Schema;
  files?: Record<string, FileValidator>;
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
  return (context: RouterContext & Context, next: Next) => {
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

    if (schemas.files) {
      const files = context.request.files;
      for (const [fileKey, validator] of Object.entries(schemas.files)) {
        if (validator.required && (!files || !files[fileKey])) {
          allErrors = [...allErrors, new FormError(fileKey, "file_required")];
          continue;
        }

        if (files && files[fileKey]) {
          const file = files[fileKey];
          if (Array.isArray(file)) {
            allErrors = [
              ...allErrors,
              new FormError(fileKey, "file_cant_be_array"),
            ];
            continue;
          }

          if (validator.size && file.size > validator.size) {
            allErrors = [...allErrors, new FormError(fileKey, "file_too_big")];
            continue;
          }

          if (validator.mimeTypes) {
            if (!file.mimetype) {
              allErrors = [
                ...allErrors,
                new FormError(fileKey, "invalid_file"),
              ];
              continue;
            }

            if (typeof validator.mimeTypes === "function") {
              const response = validator.mimeTypes(file.mimetype);
              if (response) {
                allErrors = [...allErrors, new FormError(fileKey, response)];
              }

              continue;
            }

            const mimeTypes = Array.isArray(validator.mimeTypes)
              ? validator.mimeTypes
              : [validator.mimeTypes];

            if (!mimeTypes.includes(file.mimetype)) {
              allErrors = [
                ...allErrors,
                new FormError(fileKey, "file_type_invalid"),
              ];
              continue;
            }
          }
        }
      }
    }

    if (allErrors.length) {
      context.response.body = allErrors;
      context.response.status = 400;
      return context;
    }

    return next();
  };
};
