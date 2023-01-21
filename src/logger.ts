import { Logtail } from "@logtail/node";
import config from "./config";

const logtail = new Logtail(config.logtailToken);

export default logtail;
