import dayjs from "dayjs";
import config from "../../../config";
import database from "../../database";
import { defineJob } from "../job";

/**
 * Runs every minute
 *
 * Check if a reset password token is expired :
 * - update `resetPasswordLastCheck` if still valid
 * - reset columns if expired
 */
export default defineJob("reset_password", "* * * * *", async () => {
  const users = await database.user.findMany({
    select: { id: true, resetPasswordLastCheck: true },
    where: { resetPasswordToken: { not: null } },
  });

  for (const user of users) {
    const date = dayjs(user.resetPasswordLastCheck);
    const expirationDate = date.add(
      config.cron.resetPasswordLinkDuration,
      "minutes"
    );

    if (dayjs() > expirationDate) {
      await database.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: null,
          resetPasswordLastCheck: null,
        },
      });
    } else {
      await database.user.update({
        where: { id: user.id },
        data: {
          resetPasswordLastCheck: new Date(),
        },
      });
    }
  }
});
