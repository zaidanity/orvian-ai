import { NextRequest, NextResponse } from "next/server";
import { setActiveSession, getSessionById } from "@/lib/sessions";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const success = setActiveSession(id);
  const session = getSessionById(id);
  
  if (!success || !session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    activeSessionId: id,
    session,
  });
}
