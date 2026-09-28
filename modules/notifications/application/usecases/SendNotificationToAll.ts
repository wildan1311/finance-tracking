import NotificationPayload from "../../domain/entities/NotificationPayload";
import PushSubscriptionRepository from "../../domain/repositories/PushSubscriptionRepository";
import PushSender, { PushDeliveryError } from "../../domain/services/PushSender";

interface DispatchResult {
  sent: number;
  failed: number;
  /** Subscriptions dropped because the push service reported them as gone. */
  pruned: number;
  total: number;
}

/**
 * Fans a payload out to every stored subscription.
 *
 * One bad endpoint must never stop the others, so failures are collected rather
 * than thrown. Dead endpoints (404/410) are pruned on the way out — otherwise
 * the store slowly fills with subscriptions that can never be delivered to.
 */
class SendNotificationToAll {
  constructor(
    private subscriptionRepo: PushSubscriptionRepository,
    private pushSender: PushSender,
  ) {}

  async execute(payload: NotificationPayload): Promise<DispatchResult> {
    const subscriptions = await this.subscriptionRepo.findAll();

    const results = await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await this.pushSender.send(subscription, payload);
          return "sent" as const;
        } catch (error) {
          if (error instanceof PushDeliveryError && error.isExpired) {
            await this.subscriptionRepo.removeByEndpoint(subscription.endpoint);
            return "pruned" as const;
          }
          console.error(
            `[notifications] delivery failed for ${subscription.endpoint}`,
            error,
          );
          return "failed" as const;
        }
      }),
    );

    return {
      sent: results.filter((r) => r === "sent").length,
      failed: results.filter((r) => r === "failed").length,
      pruned: results.filter((r) => r === "pruned").length,
      total: subscriptions.length,
    };
  }
}

export type { DispatchResult };
export default SendNotificationToAll;
