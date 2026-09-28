import { NextRequest, NextResponse } from "next/server";
import { unsubscribeDevice } from "@/modules/notifications/presentation/actions/notifications.actions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const endpoint = (body as { endpoint?: unknown } | null)?.endpoint;

  try {
    const result = await unsubscribeDevice(endpoint);
    return NextResponse.json(result, { status: result.status ? 200 : 400 });
  } catch (error) {
    console.error("POST /api/push/unsubscribe failed:", error);
    return NextResponse.json(
      { status: false, message: "Failed to remove subscription." },
      { status: 500 },
    );
  }
}
