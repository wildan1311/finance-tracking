import NotificationPayload from "../entities/NotificationPayload";
import PushSubscription from "../entities/PushSubscription";

/**
 * Raised when the push service rejects a delivery.
 *
 * `statusCode` matters: 404 and 410 mean the subscription is gone for good and
 * the caller should prune it.
 */
class PushDeliveryError extends Error {
  constructor(
    public statusCode: number | undefined,
    message: string,
  ) {
    super(message);
    this.name = "PushDeliveryError";
  }

  get isExpired(): boolean {
    return this.statusCode === 404 || this.statusCode === 410;
  }
}

/**
 * Port for delivering a push message to one subscription.
 *
 * Implemented by `infrastructure/services/PushService.ts` (web-push).
 * Declared here so use cases never import an HTTP/VAPID library.
 */
interface PushSender {
  send(
    subscription: PushSubscription,
    payload: NotificationPayload,
  ): Promise<void>;
}

export { PushDeliveryError };
export default PushSender;
