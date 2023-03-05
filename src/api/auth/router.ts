import Router from "@koa/router";
import controller from "./controller";
import middleware from "./middleware";

const router = new Router({ prefix: "/auth" });

router.get("/me", middleware.me, controller.me);

router.post("/login", middleware.login, controller.login);
router.post("/register", middleware.register, controller.register);
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
