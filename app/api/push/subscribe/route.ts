import { NextRequest, NextResponse } from "next/server";
import { subscribeDevice } from "@/modules/notifications/presentation/actions/notifications.actions";

export const dynamic = "force-dynamic";

/**
 * Registers a browser push subscription.
 *
 * Public by necessity: a service worker cannot send the user's auth cookie from
 * a `pushsubscriptionchange` event, so this endpoint cannot require a session.
 */
export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const result = await subscribeDevice(body);
    return NextResponse.json(result, { status: result.status ? 201 : 400 });
  } catch (error) {
    console.error("POST /api/push/subscribe failed:", error);
    return NextResponse.json(
      { status: false, message: "Failed to store subscription." },
      { status: 500 },
    );
  }
}
