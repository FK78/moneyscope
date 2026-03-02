import { NextRequest, NextResponse } from "next/server";
import { searchTicker } from "@/lib/yahoo-finance";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await getCurrentUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q") ?? "";
  if (query.length < 1) {
    return NextResponse.json([]);
  }

  const results = await searchTicker(query);
  return NextResponse.json(results);
}
