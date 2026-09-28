"use server";

import ResponseMaker from "@/modules/shared/application/ResponseMaker";
import SubscribeDevice from "@/modules/notifications/application/usecases/SubscribeDevice";
import SendNotificationToAll from "@/modules/notifications/application/usecases/SendNotificationToAll";
import SendDailyReminder from "@/modules/notifications/application/usecases/SendDailyReminder";
import UnsubscribeDevice from "@/modules/notifications/application/usecases/UnsubscribeDevice";
import PushSubscription from "@/modules/notifications/domain/entities/PushSubscription";
import {
  createPushSubscriptionRepository,
  createReminderLogRepository,
} from "@/modules/notifications/infrastructure/repositories";
import PushService from "@/modules/notifications/infrastructure/services/PushService";
import { pushSubscriptionSchema } from "@/modules/notifications/presentation/schemas/push-subscription.schema";
import { env } from "@/config/env";

function createDispatch(): SendNotificationToAll {
  return new SendNotificationToAll(createPushSubscriptionRepository(), new PushService());
}

export async function subscribeDevice(subscription: unknown) {
  const parsed = pushSubscriptionSchema.safeParse(subscription);

  if (!parsed.success) {
    return ResponseMaker.makeErrorResponse("Invalid push subscription payload.");
  }

  try {
    await new SubscribeDevice(createPushSubscriptionRepository()).execute(
      PushSubscription.fromJson(parsed.data),
    );
    return ResponseMaker.makeSuccessResponse("Notifications enabled.");
  } catch (error) {
    console.error("Error subscribing device:", error);
    throw error;
  }
}

export async function unsubscribeDevice(endpoint: unknown) {
  if (typeof endpoint !== "string" || endpoint.length === 0) {
    return ResponseMaker.makeErrorResponse("An endpoint is required to unsubscribe.");
  }

  try {
    await new UnsubscribeDevice(createPushSubscriptionRepository()).execute(endpoint);
    return ResponseMaker.makeSuccessResponse("Notifications disabled.");
  } catch (error) {
    console.error("Error unsubscribing device:", error);
    throw error;
  }
}

/**
 * Manual trigger from the Settings screen. Also the only practical way to
 * confirm push works end to end, which is why it exists alongside the cron.
 */
export async function sendTestNotification() {
  try {
    const result = await createDispatch().execute({
      title: "Finance Tracker",
      body: "Test notification — push is working.",
      url: "/transactions",
      tag: "finance-test",
    });

    if (result.total === 0) {
      return ResponseMaker.makeErrorResponse(
        "No devices subscribed yet. Enable notifications on this device first.",
      );
    }

    return ResponseMaker.makeSuccessResponse(
      `Sent to ${result.sent}/${result.total} device(s).` +
        (result.pruned ? ` Pruned ${result.pruned} expired.` : ""),
    );
  } catch (error) {
    console.error("Error sending test notification:", error);
    throw error;
  }
}

/** Manual trigger for the daily reminder; the cron uses the same use case. */
export async function sendDailyReminderNow() {
  try {
    const useCase = new SendDailyReminder(
      createDispatch(),
      createReminderLogRepository(),
      env.notificationTimezone,
    );

    const result = await useCase.execute();

    if (result.skipped) {
      return ResponseMaker.makeErrorResponse(
        `Already sent today (${result.dayKey}). The daily reminder is once per day.`,
      );
    }

    return ResponseMaker.makeSuccessResponse(
      `Reminder sent to ${result.sent}/${result.total} device(s) for ${result.dayKey}.`,
    );
  } catch (error) {
    console.error("Error sending daily reminder:", error);
    throw error;
  }
}
