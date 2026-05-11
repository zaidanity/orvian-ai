"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AVAILABLE_MODELS, ModelId } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-md bg-[#1a1a1a] px-2 py-1 text-xs text-gray-300 hover:bg-[#2a2a2a] transition-colors"
      >
        <span className="hidden sm:inline">{selected?.name}</span>
        <span className="sm:hidden text-xs">Model</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg z-50 overflow-hidden">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors ${
                selectedModel === model.id
                  ? "bg-[#2a2a2a] text-blue-400"
                  : "text-gray-300 hover:bg-[#2a2a2a]"
              }`}
            >
              <div className="flex-1">
                <div className="text-xs font-medium">{model.name}</div>
                <div className="text-[10px] text-gray-500">{model.description}</div>
              </div>
              {selectedModel === model.id && <Check className="h-3 w-3 text-blue-400 ml-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
