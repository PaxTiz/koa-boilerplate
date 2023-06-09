import {
  afterAll,
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";
import { customFetch } from "../../fetch";
import { createFakeUser, deleteFakeUser } from "../../lib/auth";
import { ApiError } from "../../types";

let fakeUser;

describe("Authentication", () => {
  beforeAll(async () => {
    fakeUser = await createFakeUser();
  });

  afterAll(async () => {
    await deleteFakeUser();
  });

  describe("Login", () => {
    it("should not login if body is empty", async () => {
      const response = await customFetch("POST", "/auth/login");

      expect(response.status).toBe(400);

      const body = await response.json();
      expectTypeOf<Array<ApiError>>(body);
      expect(body).toHaveLength(2);

      const emailError = body.find((e) => e.param === "email");
      expect(emailError).not.toBeUndefined();

      const passwordError = body.find((e) => e.param === "email");
      expect(passwordError).not.toBeUndefined();
    });

    it("should not login if no email is sent", async () => {
      const response = await customFetch(
        "POST",
        "/auth/login",
        JSON.stringify({
          password: "#anAmazingPassword1234",
        })
      );

      expect(response.status).toBe(400);

      const body = await response.json();
      expectTypeOf<Array<ApiError>>(body);
      expect(body).toHaveLength(1);

      const emailError = body.find((e) => e.param === "email");
      expect(emailError).not.toBeUndefined();
    });

    it("should not login if wrong email is sent", async () => {
      const response = await customFetch(
        "POST",
        "/auth/login",
        JSON.stringify({
          email: "this is not an email",
          password: "#anAmazingPassword1234",
        })
      );

      expect(response.status).toBe(400);

      const body = await response.json();
      expectTypeOf<Array<ApiError>>(body);
      expect(body).toHaveLength(1);

      const emailError = body.find((e) => e.param === "email");
      expect(emailError).not.toBeUndefined();
    });

    it("should not login if no password is sent", async () => {
      const response = await customFetch(
        "POST",
        "/auth/login",
        JSON.stringify({
          email: "email@domain.com",
        })
      );

      expect(response.status).toBe(400);

      const body = await response.json();
      expectTypeOf<Array<ApiError>>(body);
      expect(body).toHaveLength(1);

      const passwordError = body.find((e) => e.param === "password");
      expect(passwordError).not.toBeUndefined();
    });

    it("should not login is credentials are not found", async () => {
      const response = await customFetch(
        "POST",
        "/auth/login",
        JSON.stringify({
          email: "email@domain.com",
          password: "this an an invalid password",
        })
      );

      expect(response.status).toBe(422);

      const body = await response.json();
      expectTypeOf<Array<ApiError>>(body);
      expect(body).toHaveLength(1);

      const emailError = body.find((e) => e.param === "email");
      expect(emailError).not.toBeUndefined();
      expect(emailError.msg).toBe("invalid_credentials");
    });

    it("should login is credentials are valid", async () => {
      const response = await customFetch(
        "POST",
        "/auth/login",
        JSON.stringify(fakeUser)
      );

      expect(response.status).toBe(200);

      const body = await response.json();
      expectTypeOf<Record<string, string>>(body);
      expect(body.token).not.toBeUndefined();
    });
  });
});
