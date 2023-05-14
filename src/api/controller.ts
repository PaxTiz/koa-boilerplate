import { Context } from "koa";
import { FormError, isFormError } from "../core/errors/form_error";

export function Ok(context: Context, data: unknown, status = 200) {
  context.response.status = status;
  context.response.body = data;
  return context;
}

export function BadRequest(context: Context, message: string) {
  context.response.status = 400;
  context.response.body = { message };
  return context;
}

export class UnauthenticatedException extends Error {}
export function Unauthenticated(context: Context) {
  context.response.status = 401;
  context.response.body = { message: "not_authenticated" };
  return context;
}

export class ForbiddenException extends Error {}
export function Forbidden(context: Context) {
  context.response.status = 403;
  context.response.body = { message: "forbidden" };
  return context;
}

export class NotFoundException extends Error {}
export function NotFound(context: Context) {
  context.response.status = 404;
  context.response.body = { message: "not_found" };
  return context;
}

export function UnprocessableEntity(
  context: Context,
  errors: Array<FormError> | FormError
) {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  context.response.status = 422;
  context.response.body = errors;
  return context;
}

export function InternalServerError(context: Context) {
  context.response.status = 500;
  context.response.body = { message: "server_error" };
  return context;
}

export function File(
  context: Context,
  options: { file: Buffer; filename: string; download?: boolean }
) {
  context.response.status = 200;
  context.response.body = options.file;
  context.attachment(options.filename, {
    type: options.download ? "attachment" : "inline",
  });

  return context;
}

export function ServiceResponse(context: Context, data: unknown, status = 200) {
  if (!data) {
    return NotFound(context);
  }

  if (
    isFormError(data) ||
    (Array.isArray(data) && isFormError(data) && data.length > 0)
  ) {
    return UnprocessableEntity(context, data);
  }

  return Ok(context, data, status);
}
