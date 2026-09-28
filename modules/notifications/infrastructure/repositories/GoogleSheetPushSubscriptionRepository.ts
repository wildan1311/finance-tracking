import { env } from "@/config/env";
import GoogleSheetsClient from "@/modules/shared/infrastructure/services/GoogleSheetsClient";
import PushSubscription from "@/modules/notifications/domain/entities/PushSubscription";
import PushSubscriptionRepository from "@/modules/notifications/domain/repositories/PushSubscriptionRepository";

/**
 * Sheet layout (positional, like the transactions tab):
 *   subscriptions!A2:D → endpoint | p256dh | auth | createdAt
 *
 * Enable `PUSH_STORE=sheet` to use this. It is the only store that survives a
 * Vercel deploy, since the serverless filesystem does not.
 */
const TAB = "subscriptions";
const RANGE = `${TAB}!A2:D`;
const HEADER = ["endpoint", "p256dh", "auth", "createdAt"];

class GoogleSheetPushSubscriptionRepository implements PushSubscriptionRepository {
  constructor(
    private googleService: GoogleSheetsClient = new GoogleSheetsClient(),
  ) {}

  private get sheetId(): string {
    return env.spreadsheetId || "";
  }

  /** Creates the `subscriptions` tab on first use. */
  private async ensureTab(): Promise<void> {
    await this.googleService.ensureSheet(this.sheetId, TAB, HEADER);
  }

  async findAll(): Promise<PushSubscription[]> {
    await this.ensureTab();

    const response = await this.googleService.getSheetsRange(this.sheetId, RANGE);
    const rows = response?.data?.values ?? [];

    return rows
      .filter((row: any[]) => row?.[0])
      .map(([endpoint, p256dh, auth, createdAt]: any[]) =>
        new PushSubscription(endpoint, p256dh, auth, createdAt ?? undefined),
      );
  }

  /**
   * Sheets has no upsert, so this reads the block, replaces the matching row in
   * memory, then rewrites the range. Fine at personal-app scale; a high-volume
   * store would want a real database.
   */
  async save(subscription: PushSubscription): Promise<void> {
    const current = (await this.findAll()).filter(
      (item) => item.endpoint !== subscription.endpoint,
    );

    const rows = [
      ...current.map((item) => [
        item.endpoint,
        item.p256dh,
        item.auth,
        item.createdAt,
      ]),
      [subscription.endpoint, subscription.p256dh, subscription.auth, subscription.createdAt],
    ];

    await this.googleService.clearSheetsRange(this.sheetId, RANGE);
    if (rows.length > 0) {
      await this.googleService.updateSheetsRange(this.sheetId, RANGE, rows);
    }
  }

  async removeByEndpoint(endpoint: string): Promise<void> {
    const all = await this.findAll();
    const remaining = all.filter((item) => item.endpoint !== endpoint);

    if (remaining.length === all.length) return;

    await this.googleService.clearSheetsRange(this.sheetId, RANGE);
    if (remaining.length > 0) {
      await this.googleService.updateSheetsRange(
        this.sheetId,
        RANGE,
        remaining.map((item) => [item.endpoint, item.p256dh, item.auth, item.createdAt]),
      );
    }
  }

  async count(): Promise<number> {
    return (await this.findAll()).length;
  }
}

export default GoogleSheetPushSubscriptionRepository;
