import { NextRequest, NextResponse } from "next/server";
import { editSessionTitle } from "@/lib/sessions";

export async function POST(request: NextRequest) {
  try {
    const { id, title } = await request.json();
    if (!id || !title) {
      return NextResponse.json({ error: "Missing id or title" }, { status: 400 });
    }
    const success = await editSessionTitle(id, title);
    if (success) return NextResponse.json({ success: true });
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
