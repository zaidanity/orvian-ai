"use client";

import { useState } from "react";
import { Plus, Trash2, MessageSquare, ChevronLeft, MoreHorizontal, Edit2, Pin, PinOff } from "lucide-react";

interface Session {
  id: string;
  title: string;
  isPinned?: boolean;
}

interface SidebarProps {
  sessions: Session[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
  onClose?: () => void;
  isMobile: boolean;
  isOpen?: boolean;
}

export default function Sidebar({ 
  sessions, 
  activeId, 
  onNewChat, 
  onSelect, 
  onDelete, 
  onEdit,
  onPin,
  onClose, 
  isMobile,
  isOpen = true 
}: SidebarProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Urutkan sesi: pinned di atas, lalu berdasarkan updatedAt
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleEdit = (session: Session) => {
    setEditingId(session.id);
    setEditTitle(session.title);
    setMenuOpenId(null);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onEdit(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
    setMenuOpenId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handlePin = (session: Session) => {
    onPin(session.id, !session.isPinned);
    setMenuOpenId(null);
  };

  // Jika sidebar tertutup (hanya untuk desktop), render null
  if (!isMobile && !isOpen) {
    return null;
  }

  return (
    <div className={`flex h-full flex-col bg-[#111111] border-r border-[#2a2a2a] transition-all duration-300 ${!isMobile && !isOpen ? "w-0 overflow-hidden border-0" : "w-72"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">ORVIAN AI</span>
        </div>
        <div className="flex items-center gap-1">
          {!isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition"
              title="Tutup sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Chat Baru
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2">
        <p className="mb-2 px-2 text-xs text-gray-500">RIWAYAT CHAT</p>
        {sortedSessions.length === 0 ? (
          <p className="px-2 text-sm text-gray-500">Belum ada chat</p>
        ) : (
          <div className="space-y-0.5">
            {sortedSessions.map((s) => (
              <div key={s.id} className="group relative">
                {/* Sedang edit */}
                {editingId === s.id ? (
                  <div className="flex items-center gap-1 p-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(s.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 rounded-md bg-[#1a1a1a] px-2 py-1.5 text-sm text-white border border-[#2a2a2a] focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(s.id)}
                      className="px-2 py-1 text-xs text-blue-400 hover:bg-[#1a1a1a] rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <button
                      onClick={() => onSelect(s.id)}
                      className={`flex-1 truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        activeId === s.id 
                          ? "bg-[#1a1a1a] text-blue-400" 
                          : "text-gray-300 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {s.isPinned && <Pin className="h-3 w-3 text-yellow-400" />}
                        <MessageSquare className="h-3 w-3" />
                        <span className="truncate">{s.title}</span>
                      </div>
                    </button>
                    
                    {/* Tombol ... (menu) */}
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === s.id ? null : s.id)}
                      className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded-md transition"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpenId === s.id && (
                      <>
                        {/* Overlay untuk menutup menu saat klik di luar */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuOpenId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 w-32 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden">
                          <button
                            onClick={() => handleEdit(s)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handlePin(s)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition"
                          >
                            {s.isPinned ? (
                              <>
                                <PinOff className="h-3.5 w-3.5" />
                                Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="h-3.5 w-3.5" />
                                Pin
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(s.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-80 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Hapus Chat?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Apakah Anda yakin ingin menghapus chat ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] rounded-md transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#2a2a2a] p-3">
        <p className="text-xs text-gray-500 text-center">© 2026 ZDN1SM. All rights reserved.</p>
      </div>
    </div>
  );
}
