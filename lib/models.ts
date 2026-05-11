// lib/models.ts
export const AVAILABLE_MODELS = [
  { id: "openai/gpt-oss-120b", name: "GPT OSS 120B", description: "Paling cerdas, untuk coding & reasoning" },
  { id: "openai/gpt-oss-20b", name: "GPT OSS 20B", description: "Seimbang, cepat & cerdas" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", description: "Cepat, akurasi tinggi" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", description: "Paling cepat, hemat kuota" },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]["id"];
