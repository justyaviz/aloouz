import { NextResponse } from "next/server";

import { AsaxiySyncError, syncAsaxiyCatalog } from "@/lib/asaxiy-sync";

function isAuthorized(request: Request) {
  const secret = process.env.ASAXIY_SYNC_SECRET?.trim();

  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await syncAsaxiyCatalog({ replaceCatalog: true });
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    const message =
      error instanceof AsaxiySyncError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Asaxiy sync bajarilmadi.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
