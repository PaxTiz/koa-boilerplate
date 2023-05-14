import cron from "node-cron";
import config from "../../config";
import { useLogger } from "../../logger";

const log = (key: string, message: string) => {
  if (config.cron.enableTaskLogs) {
    console.info(`[CRON:${key}] ${message}`);
  }
};

export const defineJob = (
  key: string,
  schedule: string,
  handler: () => Promise<void>
) => {
  const logger = useLogger(`CRON:${key}`);

  return cron.schedule(
    schedule,
    async () => {
      log(key, "Start job");
      try {
        await handler();
        log(key, "End job successfully\n");
      } catch (e) {
        logger.error(e);
        log(key, "Failed to execute job\n");
      }
    },
    {
      timezone: "Europe/Paris",
      scheduled: false,
      runOnInit: false,
    }
  );
};
