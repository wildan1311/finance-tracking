import ReminderLogRepository from "../../domain/repositories/ReminderLogRepository";
import SendNotificationToAll from "./SendNotificationToAll";

/** Copy lives here so it can be changed in one place. */
const DAILY_REMINDER = {
  title: "Finance Tracker",
  body: "Don't forget to record expenses and income today.",
  url: "/transactions",
  tag: "finance-daily-reminder",
};

interface DailyReminderResult {
  skipped: boolean;
  dayKey: string;
  sent: number;
  failed: number;
  pruned: number;
  total: number;
}

/**
 * The scheduled reminder: once per day, in the user's timezone.
 *
 * Idempotent per day. Vercel retries cron invocations and the Settings screen
 * has a manual trigger, so without the log check the user would get repeats.
 */
class SendDailyReminder {
  constructor(
    private dispatch: SendNotificationToAll,
    private reminderLog: ReminderLogRepository,
    private timezone: string,
    private now: () => Date = () => new Date(),
  ) {}

  async execute(): Promise<DailyReminderResult> {
    const dayKey = this.dayKeyIn(this.timezone);

    if (await this.reminderLog.wasSentOn(dayKey)) {
      return { skipped: true, dayKey, sent: 0, failed: 0, pruned: 0, total: 0 };
    }

    const result = await this.dispatch.execute(DAILY_REMINDER);
    await this.reminderLog.markSent(dayKey, result.sent);

    return { skipped: false, dayKey, ...result };
  }

  /**
   * "Today" in the configured timezone.
   *
   * Uses `Intl` rather than `toISOString()`, which would resolve the day in UTC
   * and fire the reminder at the wrong time for users east or west of it.
   */
  private dayKeyIn(timezone: string): string {
    // en-CA formats as YYYY-MM-DD.
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(this.now());
  }
}

export { DAILY_REMINDER };
export type { DailyReminderResult };
export default SendDailyReminder;
