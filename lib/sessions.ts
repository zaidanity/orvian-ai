export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageData?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  isPinned?: boolean;
}

let sessions: ChatSession[] = [];
let activeSessionId: string | null = null;

export function createNewSession(): ChatSession {
  const newSession: ChatSession = {
    id: Date.now().toString(),
    title: `Chat Baru ${sessions.length + 1}`,
    messages: [],
    updatedAt: new Date(),
    isPinned: false,
  };
  sessions.unshift(newSession);
  activeSessionId = newSession.id;
  return newSession;
}

export function getAllSessions(): ChatSession[] {
  return [...sessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}

export function getSessionById(id: string): ChatSession | undefined {
  return sessions.find(s => s.id === id);
}

export function getActiveSession(): ChatSession | null {
  return activeSessionId ? getSessionById(activeSessionId) || null : null;
}

export function setActiveSession(id: string): boolean {
  const session = getSessionById(id);
  if (session) {
    activeSessionId = id;
    return true;
  }
  return false;
}

export function addMessageToSession(
  sessionId: string,
  message: Omit<Message, "id">
): Message | null {
  const session = getSessionById(sessionId);
  if (!session) return null;

  const newMessage: Message = { id: Date.now().toString(), ...message };
  session.messages.push(newMessage);
  session.updatedAt = new Date();

  if (session.messages.length === 1 && message.role === "user") {
    const title = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");
    session.title = title;
  }
  return newMessage;
}

export function deleteSession(id: string): boolean {
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    sessions.splice(index, 1);
    if (activeSessionId === id) {
      activeSessionId = sessions[0]?.id || null;
    }
    return true;
  }
  return false;
}

export function editSessionTitle(id: string, newTitle: string): boolean {
  const session = getSessionById(id);
  if (session) {
    session.title = newTitle;
    session.updatedAt = new Date();
    return true;
  }
  return false;
}

export function pinSession(id: string, isPinned: boolean): boolean {
  const session = getSessionById(id);
  if (session) {
    session.isPinned = isPinned;
    session.updatedAt = new Date();
    return true;
  }
  return false;
}

export function formatHistoryForAI(messages: Message[]): Array<{ role: string; content: string }> {
  return messages.map(m => ({ role: m.role, content: m.content }));
}
