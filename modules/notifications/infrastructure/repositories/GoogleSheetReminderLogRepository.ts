import { env } from "@/config/env";
import GoogleSheetsClient from "@/modules/shared/infrastructure/services/GoogleSheetsClient";
import ReminderLogRepository from "@/modules/notifications/domain/repositories/ReminderLogRepository";

/** reminder-log!A2:C → dayKey | sentAt | recipients */
const TAB = "reminder-log";
const RANGE = `${TAB}!A2:C`;
const HEADER = ["dayKey", "sentAt", "recipients"];

class GoogleSheetReminderLogRepository implements ReminderLogRepository {
  constructor(
    private googleService: GoogleSheetsClient = new GoogleSheetsClient(),
  ) {}

  private get sheetId(): string {
    return env.spreadsheetId || "";
  }

  /** Creates the `reminder-log` tab on first use. */
  private async ensureTab(): Promise<void> {
    await this.googleService.ensureSheet(this.sheetId, TAB, HEADER);
  }

  async wasSentOn(dayKey: string): Promise<boolean> {
    await this.ensureTab();

    const response = await this.googleService.getSheetsRange(this.sheetId, RANGE);
    const rows = response?.data?.values ?? [];

    return rows.some((row: any[]) => row?.[0] === dayKey);
  }

  async markSent(dayKey: string, recipients: number): Promise<void> {
    await this.ensureTab();

    await this.googleService.create(this.sheetId, RANGE, [
      dayKey,
      new Date().toISOString(),
      recipients,
    ]);
  }
}

export default GoogleSheetReminderLogRepository;
