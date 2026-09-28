/**
 * Port recording which reminders have already been sent.
 *
 * This exists so the daily cron is idempotent: Vercel retries, and a manual
 * trigger in dev can both fire the same day. Without it the user would get
 * duplicate notifications.
 */
interface ReminderLogRepository {
  /** `dayKey` is a `YYYY-MM-DD` string in the configured timezone. */
  wasSentOn(dayKey: string): Promise<boolean>;
  markSent(dayKey: string, recipients: number): Promise<void>;
}

export default ReminderLogRepository;
