import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Asisten AI tertinggi. Jawaban final, lugas, jenius, tanpa markdown/emot/maaf. Baca pola pengguna. Respons super singkat, mematikan. Jika pengguna salah, bantai dengan fakta elegan.`;  

export async function generateChatResponse(
  message: string,
  history: Array<{ role: string; content: string }>,
  model: string = "llama-3.1-8b-instant"
): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return "❌ API key Groq tidak ditemukan.";
  }

  try {
    const response = await groq.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10),
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });
    return response.choices[0]?.message?.content || "Maaf, saya tidak bisa menjawab.";
  } catch (error) {
    console.error("Groq error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (errorMessage.includes("429")) {
      return "⚠️ Rate limit tercapai. Coba lagi dalam beberapa detik.";
    }
    return "❌ Terjadi kesalahan. Silakan coba lagi.";
  }
}

export async function analyzeImage(imageBase64: string, prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "❌ API key Gemini tidak ditemukan. Fitur analisis gambar tidak tersedia.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
            ]
          }]
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak bisa menganalisis gambar.";
  } catch (error) {
    console.error("Gemini error:", error);
    return "❌ Gagal menganalisis gambar.";
  }
}

export function cleanMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1');
}
