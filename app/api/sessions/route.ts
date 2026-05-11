import { NextRequest, NextResponse } from "next/server";
import { getAllSessions, getActiveSession, createNewSession, deleteSession } from "@/lib/sessions";

export async function GET() {
  const sessions = getAllSessions();
  const activeSession = getActiveSession();
  return NextResponse.json({
    sessions,
    activeSessionId: activeSession?.id || null,
  });
}

export async function POST() {
  const newSession = createNewSession();
  const sessions = getAllSessions();
  return NextResponse.json({
    sessions,
    activeSessionId: newSession.id,
  });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (id) deleteSession(id);
  const sessions = getAllSessions();
  const activeSession = getActiveSession();
  return NextResponse.json({
    sessions,
    activeSessionId: activeSession?.id || null,
  });
}
