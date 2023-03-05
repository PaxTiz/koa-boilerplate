import cron from "node-cron";

const log = (key: string, message: string) => {
  console.log(`[CRON:${key}] ${message}`);
};

export const job = async (key: string, task: () => Promise<void>) => {
  log(key, "Start job");
  return task().then(() => {
    log(key, "End job successfully\n");
  });
};

export default (schedule: string, handler: Promise<void>) =>
  cron.schedule(schedule, () => handler, {
    timezone: "Europe/Paris",
    scheduled: false,
    runOnInit: false,
  });
