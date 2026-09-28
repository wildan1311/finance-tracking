// `server-only` makes any accidental import from a Client Component a build
// error instead of silently bundling web-push into the browser.
import "server-only";
import webpush, { WebPushError } from "web-push";
import { env } from "@/config/env";
import NotificationPayload from "@/modules/notifications/domain/entities/NotificationPayload";
import PushSubscription from "@/modules/notifications/domain/entities/PushSubscription";
import PushSender, {
  PushDeliveryError,
} from "@/modules/notifications/domain/services/PushSender";

/**
 * Sends notifications through the Web Push protocol using VAPID.
 *
 * Server-only: `web-push` is a Node library and must never be bundled to the
 * client. It is only imported from API routes and server actions.
 *
 * VAPID details are set once per process — `setVapidDetails` throws if called
 * twice with different keys, and Next.js reuses module scope across requests.
 */
class PushService implements PushSender {
  private static configured = false;

  private static configure(): void {
    if (PushService.configured) return;

    const { vapidPublicKey, vapidPrivateKey, vapidSubject } = env;

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error(
        "VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are not set. Run: npx web-push generate-vapid-keys",
      );
    }

    webpush.setVapidDetails(
      vapidSubject || "mailto:admin@example.com",
      vapidPublicKey,
      vapidPrivateKey,
    );

    PushService.configured = true;
  }

  async send(
    subscription: PushSubscription,
    payload: NotificationPayload,
  ): Promise<void> {
    PushService.configure();

    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        JSON.stringify(payload),
        // Expired messages should be dropped rather than delivered tomorrow.
        { TTL: 60 * 60, urgency: "normal" },
      );
    } catch (error) {
      if (error instanceof WebPushError) {
        throw new PushDeliveryError(error.statusCode, error.message);
      }
      throw new PushDeliveryError(undefined, String(error));
    }
  }
}

export default PushService;
