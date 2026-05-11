"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageData?: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-white">ORVIAN AI</h2>
        <p className="mt-2 text-gray-400 text-sm">Asisten AI cerdas Anda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 px-4 py-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
        >
          {m.role === "user" ? (
            // User message - dengan bubble
            <div className="max-w-[75%] rounded-2xl bg-[#2a2a2a] text-white rounded-br-md px-4 py-2.5">
              {m.imageData && (
                <div className="mb-2">
                  <img
                    src={`data:image/jpeg;base64,${m.imageData}`}
                    alt="uploaded"
                    className="max-h-40 rounded-lg"
                  />
                </div>
              )}
              <div className="prose prose-sm max-w-none prose-invert">
                <ReactMarkdown
                  components={{
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                    p: ({ node, ...props }) => <p className="my-1" {...props} />,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
              <button
                onClick={() => handleCopy(m.id, m.content)}
                className="mt-1.5 opacity-50 hover:opacity-100 transition inline-flex"
              >
                {copiedId === m.id ? (
                  <Check className="h-3 w-3 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-400" />
                )}
              </button>
            </div>
          ) : (
            // AI message - tanpa bubble, langsung teks dengan format list yang benar
            <div className="max-w-[85%] text-gray-200">
              {m.imageData && (
                <div className="mb-2">
                  <img
                    src={`data:image/jpeg;base64,${m.imageData}`}
                    alt="uploaded"
                    className="max-h-40 rounded-lg"
                  />
                </div>
              )}
              <div className="prose prose-sm max-w-none prose-invert">
                <ReactMarkdown
                  components={{
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                    p: ({ node, ...props }) => <p className="my-1" {...props} />,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
              <button
                onClick={() => handleCopy(m.id, m.content)}
                className="mt-1.5 opacity-50 hover:opacity-100 transition inline-flex"
              >
                {copiedId === m.id ? (
                  <Check className="h-3 w-3 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-500" />
                )}
              </button>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-[#1a1a1a] px-4 py-3 border border-[#2a2a2a]">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}