import { NextRequest, NextResponse } from "next/server";
import { getSessionById, addMessageToSession, formatHistoryForAI } from "@/lib/sessions";
import { generateChatResponse, analyzeImage, cleanMarkdown } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, imageBase64 } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }
    
    const session = getSessionById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    let userMessage = message || "";
    let aiResponse = "";
    
    if (imageBase64) {
      const prompt = message || "Deskripsikan gambar ini dalam bahasa Indonesia.";
      aiResponse = await analyzeImage(imageBase64, prompt);
      userMessage = message ? `[Gambar] ${message}` : "[Gambar] Deskripsikan gambar ini";
    }
    else if (message && message.trim()) {
      const history = formatHistoryForAI(session.messages);
      aiResponse = await generateChatResponse(message, history);
      userMessage = message;
    }
    else {
      return NextResponse.json({ error: "Message or image required" }, { status: 400 });
    }
    
    aiResponse = cleanMarkdown(aiResponse);
    
    addMessageToSession(sessionId, { role: "user", content: userMessage, imageData: imageBase64 });
    addMessageToSession(sessionId, { role: "assistant", content: aiResponse });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
