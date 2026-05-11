"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import ModelSelector from "./components/ModelSelector";
import { Menu } from "lucide-react";
import { AVAILABLE_MODELS, ModelId } from "@/lib/models";

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
  const [selectedModel, setSelectedModel] = useState<ModelId>("llama-3.1-8b-instant");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    loadSessions();
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadSessions = async () => {
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data.sessions);
    setActiveId(data.activeSessionId);
  };

  const createSession = async () => {
    const res = await fetch("/api/sessions", { method: "POST" });
    const data = await res.json();
    setSessions(data.sessions);
    setActiveId(data.activeSessionId);
    setMobileMenuOpen(false);
  };

  const selectSession = async (id: string) => {
    await fetch(`/api/sessions/${id}`, { method: "PUT" });
    setActiveId(id);
    setMobileMenuOpen(false);
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
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const pinSession = async (id: string, isPinned: boolean) => {
    await fetch("/api/sessions/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isPinned }),
    });
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned } : s));
  };

  const sendMessage = async (message: string, imageBase64?: string) => {
    let id = activeId;
    if (!id) {
      const res = await fetch("/api/sessions", { method: "POST" });
      const data = await res.json();
      id = data.activeSessionId;
      setActiveId(id);
      setSessions(data.sessions);
    }

    setIsLoading(true);
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sessionId: id, 
        message, 
        imageBase64,
        model: selectedModel
      }),
    });
    await loadSessions();
    setIsLoading(false);
  };

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
        <header className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-sm px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#1a1a1a] transition"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            {!isMobile && !desktopSidebarOpen && (
              <button
                onClick={toggleDesktopSidebar}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#1a1a1a] transition"
                title="Buka sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            <h1 className="text-sm font-medium text-gray-300 truncate max-w-[150px] md:max-w-none">
              {activeSession?.title || "ORVIAN AI"}
            </h1>
          </div>

          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" key={activeId}>
          <MessageList messages={activeSession?.messages || []} isLoading={isLoading} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
