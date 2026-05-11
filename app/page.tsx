"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import ModelSelector from "./components/ModelSelector";
import { Menu } from "lucide-react";

export const AVAILABLE_MODELS = [
  { id: "openai/gpt-oss-120b", name: "GPT OSS 120B", description: "Paling cerdas, untuk coding & reasoning" },
  { id: "openai/gpt-oss-20b", name: "GPT OSS 20B", description: "Seimbang, cepat & cerdas" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", description: "Cepat, akurasi tinggi" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", description: "Paling cepat, hemat kuota" },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]["id"];

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelId>("llama-3.1-8b-instant");

  // ... kode lainnya tetap sama ...

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
      // ✅ Kirim model yang dipilih user
      body: JSON.stringify({ 
        sessionId: id, 
        message, 
        imageBase64,
        model: selectedModel  // <-- INI BARU
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
      {/* Sidebar (desktop & mobile) - tidak berubah */}
      <div className="hidden md:block">
        <Sidebar ... />
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 h-full">
            <Sidebar ... />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header dengan Model Selector */}
        <header className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(true)} className="mr-3 text-gray-400 hover:text-white p-1">
                <Menu className="h-5 w-5" />
              </button>
            )}
            {!isMobile && !desktopSidebarOpen && (
              <button onClick={toggleDesktopSidebar} className="mr-3 text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#1a1a1a] transition">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-sm font-medium text-gray-300 truncate">
              {activeSession?.title || "ORVIAN AI"}
            </h1>
          </div>

          {/* ✅ Model Selector di pojok kanan */}
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={activeSession?.messages || []} isLoading={isLoading} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
