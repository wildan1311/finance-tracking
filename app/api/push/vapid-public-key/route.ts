import { NextResponse } from "next/server";
import { env } from "@/config/env";

export const dynamic = "force-dynamic";

/**
 * Public VAPID key. Safe to expose — the private key never leaves the server.
 * Also read by the service worker's `pushsubscriptionchange` handler.
 */
export async function GET() {
  if (!env.vapidPublicKey) {
    return NextResponse.json(
      { error: "VAPID_PUBLIC_KEY is not configured." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { publicKey: env.vapidPublicKey },
    { headers: { "Cache-Control": "no-store" } },
  );
}
