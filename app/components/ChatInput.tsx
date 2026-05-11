"use client";

import { useState, useRef } from "react";
import { Send, Loader2, Image, X } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, imageBase64?: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ base64: string; name: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if ((!message.trim() && !selectedImage) || isLoading) return;
    
    const msgToSend = message.trim();
    const imageToSend = selectedImage?.base64;
    
    setMessage("");
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    
    await onSend(msgToSend, imageToSend);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang didukung!");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Maksimal 5MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(",")[1];
      setSelectedImage({ base64, name: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="border-t border-[#2a2a2a] bg-[#0a0a0a] p-4">
      {/* Preview Image */}
      {selectedImage && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1 text-sm">
          <Image className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">{selectedImage.name}</span>
          <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-white">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {/* Upload Image Button */}
        <button
          onClick={() => imageInputRef.current?.click()}
          className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          title="Upload gambar"
          type="button"
        >
          <Image className="h-5 w-5" />
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKey}
          placeholder={selectedImage ? "Tanyakan tentang gambar ini..." : "Ketik pesan..."}
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          style={{ minHeight: "42px", maxHeight: "100px" }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && !selectedImage) || isLoading}
          className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          type="button"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
