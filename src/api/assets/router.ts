import Router from "@koa/router";
import controller from "./controller";
import middleware from "./middleware";

const router = new Router({ prefix: "/assets" });

router.get("/:path(.*)", middleware.getFile, controller.getFile);

export default router;
