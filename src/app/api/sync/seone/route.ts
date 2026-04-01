import { NextResponse } from "next/server";

import { SeOneSyncError, syncSeOneCatalog } from "@/lib/seone-sync";

function isAuthorized(request: Request) {
  const secret = process.env.SEONE_SYNC_SECRET?.trim();

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
    const summary = await syncSeOneCatalog({ replaceCatalog: true });
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    const message =
      error instanceof SeOneSyncError
        ? error.message
        : error instanceof Error
          ? error.message
          : "SE-ONE sync bajarilmadi.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
