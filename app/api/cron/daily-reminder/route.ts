import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import SendNotificationToAll from "@/modules/notifications/application/usecases/SendNotificationToAll";
import SendDailyReminder from "@/modules/notifications/application/usecases/SendDailyReminder";
import {
  createPushSubscriptionRepository,
  createReminderLogRepository,
} from "@/modules/notifications/infrastructure/repositories";
import PushService from "@/modules/notifications/infrastructure/services/PushService";

export const dynamic = "force-dynamic";

/**
 * Daily reminder, driven by Vercel Cron (see `vercel.json`).
 *
 * GET because that is what Vercel Cron invokes. It is authenticated with
 * `CRON_SECRET` — Vercel sends `Authorization: Bearer $CRON_SECRET` when the
 * variable is set. Without a secret configured the endpoint refuses to run, so
 * it cannot be triggered by anyone who guesses the URL.
 */
export async function GET(req: NextRequest) {
  if (!env.cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured; refusing to run." },
      { status: 503 },
    );
  }

  if (req.headers.get("authorization") !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const useCase = new SendDailyReminder(
      new SendNotificationToAll(createPushSubscriptionRepository(), new PushService()),
      createReminderLogRepository(),
      env.notificationTimezone,
    );

    const result = await useCase.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/cron/daily-reminder failed:", error);
    return NextResponse.json(
      { error: "Failed to send the daily reminder." },
      { status: 500 },
    );
  }
}
