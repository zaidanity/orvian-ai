import { NextRequest, NextResponse } from "next/server";
import { pinSession } from "@/lib/sessions";

export async function POST(request: NextRequest) {
  try {
    const { id, isPinned } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const success = await pinSession(id, isPinned);
    if (success) return NextResponse.json({ success: true });
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
