import Router from "@koa/router";
import controller from "./controller";
import middleware from "./middleware";

const router = new Router({ prefix: "/users" });

router.post(
  "/forgot-password",
  middleware.forgotPassword,
  controller.forgotPassword
);
router.post(
  "/reset-password",
  middleware.resetPassword,
  controller.resetPassword
);

export default router;
