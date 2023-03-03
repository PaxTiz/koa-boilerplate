import Router from "@koa/router";
import controller from "./controller";
import middleware from "./middleware";

const router = new Router({ prefix: "/auth" });

router.get("/me", middleware.me, controller.me);

router.post("/login", middleware.login, controller.login);
router.post("/register", middleware.register, controller.register);

export default router;
