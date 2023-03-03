import { RouterContext } from "@koa/router";
import { Schema } from "joi";
import { Context, Next } from "koa";
import FormError from "../core/errors/form_error";
import { verify } from "../core/security/jwt";
import userService from "../core/services/user_service";
import { ForbiddenException, UnauthenticatedException } from "./controller";

const getTokenFromContext = (context: RouterContext) => {
  const cookie = context.cookies.get("token");
  if (cookie) {
    return cookie;
  }

  const authorizationHeader = context.headers.authorization;
  if (!authorizationHeader) {
    throw new UnauthenticatedException();
  }

  const [bearer, token] = authorizationHeader.split(" ");
  if (!bearer || !token) {
    throw new UnauthenticatedException();
  }

  return token;
};

export const isAuthenticated = async (context: RouterContext) => {
  try {
    const token = getTokenFromContext(context);
    const decodedToken = verify(token) as { id: string };
    const user = await userService.findByIdOrThrow(decodedToken.id);
    context.state.user = userService.safeUser(user);
    return context;
  } catch {
    throw new UnauthenticatedException();
  }
};

export const hasRole = (...roles: Array<string>) => {
  return (context: RouterContext) => {
    const user = context.state.user;
    if (!user) {
      throw new ForbiddenException();
    }

    if (!roles.includes(user.role.name)) {
      throw new ForbiddenException();
    }

    return context;
  };
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

const validateSchema = (object: any, schema?: Schema): Array<FormError> => {
  if (!schema || !object) {
    return [];
  }

  const errors = schema.validate(object, {
    abortEarly: false,
  });

  return errors.error ? formatErrors(errors.error) : [];
};

export const validate = (schemas: ValidateSchema) => {
  return (context: RouterContext & Context, next: Next) => {
    const allErrors = [
      ...validateSchema(context.request.body, schemas.body),
      ...validateSchema(context.params, schemas.params),
      ...validateSchema(context.request.query, schemas.query),
    ];

    if (schemas.files) {
      const files = context.request.files;
      for (const [fileKey, validator] of Object.entries(schemas.files)) {
        if (validator.required && (!files || !files[fileKey])) {
          allErrors.push(new FormError(fileKey, "file_required"));
          continue;
        }

        if (files && files[fileKey]) {
          const file = files[fileKey];
          const filesArray = Array.isArray(file) ? file : [file];

          for (const file of filesArray) {
            const error = validateFile(fileKey, validator, file);
            if (error) {
              allErrors.push(error);
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

const validateFile = (fileKey: string, validator: FileValidator, file: any) => {
  if (validator.size && file.size > validator.size) {
    return new FormError(fileKey, "file_too_big");
  }

  if (validator.mimeTypes) {
    if (!file.mimetype) {
      return new FormError(fileKey, "invalid_file");
    }

    if (typeof validator.mimeTypes === "function") {
      const response = validator.mimeTypes(file.mimetype);
      if (response) {
        return new FormError(fileKey, response);
      }
    }

    const mimeTypes = Array.isArray(validator.mimeTypes)
      ? validator.mimeTypes
      : [validator.mimeTypes];

    if (!mimeTypes.includes(file.mimetype)) {
      return new FormError(fileKey, "file_type_invalid");
    }
  }
};
