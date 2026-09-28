import { env } from "@/config/env";
import PushSubscriptionRepository from "../../domain/repositories/PushSubscriptionRepository";
import ReminderLogRepository from "../../domain/repositories/ReminderLogRepository";
import GoogleSheetPushSubscriptionRepository from "./GoogleSheetPushSubscriptionRepository";
import GoogleSheetReminderLogRepository from "./GoogleSheetReminderLogRepository";
import JsonPushSubscriptionRepository from "./JsonPushSubscriptionRepository";
import JsonReminderLogRepository from "./JsonReminderLogRepository";

/*
 * Composition root for notification storage.
 *
 * `PUSH_STORE` selects the adapter: `json` (default, local dev and long-running
 * Node hosts) or `sheet` (required on serverless, where the filesystem is
 * read-only and reset per deploy).
 */

function createPushSubscriptionRepository(): PushSubscriptionRepository {
  if (env.pushStore === "sheet") {
    console.info("[notifications] store: google sheet");
    return new GoogleSheetPushSubscriptionRepository();
  }

  console.info("[notifications] store: local json");
  return new JsonPushSubscriptionRepository();
}

function createReminderLogRepository(): ReminderLogRepository {
  if (env.pushStore === "sheet") {
    return new GoogleSheetReminderLogRepository();
  }

  return new JsonReminderLogRepository();
}

export {
  createPushSubscriptionRepository,
  createReminderLogRepository,
};
