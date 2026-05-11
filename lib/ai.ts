import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Anda adalah asisten AI yang membantu, ramah, dan informatif.
Berikan respons singkat, jelas, dalam bahasa Indonesia.
Jangan gunakan simbol markdown seperti ** atau *.
Gunakan bahasa natural.`;

export async function generateChatResponse(
  message: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return "❌ API key Groq tidak ditemukan.";
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10),
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
    return response.choices[0]?.message?.content || "Maaf, saya tidak bisa menjawab.";
  } catch (error) {
    console.error("Groq error:", error);
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
