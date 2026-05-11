"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { Menu } from "lucide-react";

interface Session {
  id: string;
  title: string;
  messages: Message[];
  isPinned?: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageData?: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  
  // Reference untuk menyimpan sessions terbaru tanpa trigger re-render
  const sessionsRef = useRef<Session[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    loadSessions();
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadSessions = useCallback(async () => {
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data.sessions);
    sessionsRef.current = data.sessions;
    setActiveId(data.activeSessionId);
  }, []);

  const createSession = async () => {
    const res = await fetch("/api/sessions", { method: "POST" });
    const data = await res.json();
    setSessions(data.sessions);
    sessionsRef.current = data.sessions;
    setActiveId(data.activeSessionId);
    setMobileMenuOpen(false);
  };

  // ✅ PERBAIKAN: Pindah sesi tanpa reload
  const selectSession = async (id: string) => {
    // Update active session di server
    await fetch(`/api/sessions/${id}`, { method: "PUT" });
    // Update activeId saja
    setActiveId(id);
    setMobileMenuOpen(false);
    // JANGAN panggil loadSessions()
  };

  const deleteSession = async (id: string) => {
    await fetch(`/api/sessions?id=${id}`, { method: "DELETE" });
    await loadSessions();
  };

  const editSessionTitle = async (id: string, newTitle: string) => {
    await fetch("/api/sessions/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: newTitle }),
    });
    // Update local state
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, title: newTitle } : s
    ));
  };

  const pinSession = async (id: string, isPinned: boolean) => {
    await fetch("/api/sessions/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isPinned }),
    });
    // Update local state
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, isPinned } : s
    ));
  };

  const sendMessage = async (message: string, imageBase64?: string) => {
    let id = activeId;
    if (!id) {
      const res = await fetch("/api/sessions", { method: "POST" });
      const data = await res.json();
      id = data.activeSessionId;
      setActiveId(id);
      setSessions(data.sessions);
      sessionsRef.current = data.sessions;
    }

    setIsLoading(true);
    
    // Simpan pesan sementara di UI (optimistic update)
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      imageData: imageBase64,
    };
    
    // Update messages di session aktif
    setSessions(prev => prev.map(s => 
      s.id === id 
        ? { ...s, messages: [...s.messages, tempUserMsg] } 
        : s
    ));

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, message, imageBase64 }),
    });
    
    // Reload untuk mendapatkan response AI
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data.sessions);
    sessionsRef.current = data.sessions;
    setActiveId(data.activeSessionId);
    setIsLoading(false);
  };

  // Ambil session aktif berdasarkan activeId
  const activeSession = sessions.find(s => s.id === activeId);

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen(!desktopSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          sessions={sessions}
          activeId={activeId}
          onNewChat={createSession}
          onSelect={selectSession}
          onDelete={deleteSession}
          onEdit={editSessionTitle}
          onPin={pinSession}
          onClose={toggleDesktopSidebar}
          isMobile={false}
          isOpen={desktopSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 h-full">
            <Sidebar
              sessions={sessions}
              activeId={activeId}
              onNewChat={createSession}
              onSelect={selectSession}
              onDelete={deleteSession}
              onEdit={editSessionTitle}
              onPin={pinSession}
              onClose={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-sm px-4 py-3 flex items-center">
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mr-3 text-gray-400 hover:text-white p-1"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {!isMobile && !desktopSidebarOpen && (
            <button
              onClick={toggleDesktopSidebar}
              className="mr-3 text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#1a1a1a] transition"
              title="Buka sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-sm font-medium text-gray-300 truncate">
            {activeSession?.title || "ORVIAN AI"}
          </h1>
        </header>

        {/* Messages - KEY prop untuk memaksa re-render saat ganti sesi */}
        <div className="flex-1 overflow-y-auto" key={activeId}>
          <MessageList messages={activeSession?.messages || []} isLoading={isLoading} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
