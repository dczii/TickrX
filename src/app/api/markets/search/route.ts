import { NextResponse, type NextRequest } from "next/server";

import { searchTickers } from "@/lib/polygon";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchTickers(query);
  return NextResponse.json({ results });
}
