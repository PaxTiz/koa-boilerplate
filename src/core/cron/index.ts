import { readdir } from "fs/promises";
import cron from "node-cron";
import { join } from "path";

export default async () => {
  const jobs = await readdir(join(__dirname, "jobs"));

  for (const job of jobs) {
    const task = await import(join(__dirname, "jobs", job));
    await task.default.start();
  }

  process.on("exit", () => {
    cron.getTasks().forEach((task) => task.stop());
  });
};
