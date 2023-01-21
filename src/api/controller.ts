import { Context } from "koa";
import FormError from "../core/errors/form_error";

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

export function Unauthenticated(context: Context) {
  context.response.status = 401;
  context.response.body = { message: "not_authenticated" };
  return context;
}

export function Forbidden(context: Context) {
  context.response.status = 403;
  context.response.body = { message: "forbidden" };
  return context;
}

export function NotFound(context: Context) {
  context.response.status = 404;
  context.response.body = { message: "not_found" };
  return context;
}

export function UnprocessableEntity(
  context: Context,
  errors: Array<FormError> | FormError
) {
  if (errors instanceof FormError) {
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

export function File(context: Context, file: Buffer, filename?: string) {
  context.response.status = 200;
  context.response.body = file;
  if (filename) {
    context.attachment(filename);
  }

  return context;
}

export function ServiceResponse(context: Context, data: unknown, status = 200) {
  if (!data) {
    return NotFound(context);
  }

  if (
    data instanceof FormError ||
    (Array.isArray(data) &&
      data.length > 0 &&
      data.every((e) => e instanceof FormError))
  ) {
    return UnprocessableEntity(context, data);
  }

  return Ok(context, data, status);
}
