import { Logtail } from "@logtail/node";
import config from "./config";

const logtail = config.enableRemoteLogging
  ? new Logtail(config.logtailToken)
  : ({} as Record<string, any>);

export default logtail;
