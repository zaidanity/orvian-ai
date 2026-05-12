# Orvian AI

<div align="center">

**Asisten AI Cerdas dengan Multi-Model Support**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://orvianai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.28-000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-API-FF6600?logo=groq)](https://console.groq.com/)
[![Gemini](https://img.shields.io/badge/Gemini-API-4285F4?logo=google)](https://aistudio.google.com/)

</div>

## 🌟 Fitur Utama

| Fitur | Keterangan |
|-------|------------|
| 💬 **Multi-Model Chat** | Ganti model AI kapan saja: Llama, GPT OSS, Qwen |
| 🖼️ **Analisis Gambar** | Upload gambar, AI jelaskan isinya (Gemini Vision) |
| 📝 **Multi-Sesi** | Buat banyak chat room, atur sesi sesuai kebutuhan |
| 📌 **Pin & Edit** | Pin chat penting, edit judul sesi |
| 📋 **Copy Teks** | Salin jawaban AI dengan satu klik |
| 🌙 **Dark Theme** | Tampilan minimalis hitam-putih-abu |
| 📱 **Responsif** | Nyaman di desktop maupun mobile |
| ⚡ **Super Cepat** | Groq LPU chip, respons 500+ token/detik |

## 🤖 Model AI yang Tersedia

| Model | Keunggulan |
|-------|------------|
| **GPT OSS 120B** | Paling cerdas, untuk coding & reasoning kompleks |
| **GPT OSS 20B** | Seimbang antara kecepatan dan kecerdasan |
| **Llama 3.3 70B** | Cepat, akurasi tinggi |
| **Llama 3.1 8B** | Paling cepat, hemat kuota (default) |

> 🖼️ **Analisis gambar** tetap menggunakan Google Gemini untuk hasil terbaik.

## 🛠️ Teknologi

| Teknologi | Fungsi |
|-----------|--------|
| **[Next.js 14](https://nextjs.org/)** | Framework React dengan App Router |
| **[TypeScript](https://www.typescriptlang.org/)** | Type safety & developer experience |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first CSS framework |
| **[Groq API](https://console.groq.com/)** | Chat AI super cepat (Llama, GPT OSS) |
| **[Google Gemini API](https://aistudio.google.com/)** | Analisis gambar (Vision) |
| **[Lucide Icons](https://lucide.dev/)** | Ikon modern & minimalis |
| **[React Markdown](https://github.com/remarkjs/react-markdown)** | Render markdown dari AI |

## 📦 Instalasi Lokal

### Prasyarat

- Node.js 18+ 
- API Key Groq ([dapatkan di sini](https://console.groq.com/))
- API Key Google Gemini ([dapatkan di sini](https://aistudio.google.com/))

### Langkah-langkah

```bash
# Clone repository
git clone https://github.com/zaidanity/Orvian-AI.git
cd Orvian-AI

# Install dependencies
npm install

# Buat file .env.local
echo "GROQ_API_KEY=your_groq_key_here" >> .env.local
echo "GEMINI_API_KEY=your_gemini_key_here" >> .env.local

# Jalankan development server
npm run dev
```

Buka http://localhost:3000

🔧 Environment Variables

Variable Wajib? Keterangan
GROQ_API_KEY ✅ Ya API key dari Groq Console
GEMINI_API_KEY ✅ Ya API key dari Google AI Studio

📁 Struktur Proyek

```
Orvian-AI/
├── app/
│   ├── api/                 # API routes
│   │   ├── chat/           # Endpoint chat AI
│   │   └── sessions/       # Manajemen sesi
│   ├── components/         # React components
│   │   ├── Sidebar.tsx
│   │   ├── MessageList.tsx
│   │   ├── ChatInput.tsx
│   │   └── ModelSelector.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── ai.ts              # Integrasi Groq & Gemini
│   ├── sessions.ts        # Manajemen sesi in-memory
│   └── models.ts          # Daftar model AI
├── public/
├── package.json
└── README.md
```

🎯 Fitur yang Akan Datang

- Database permanen (Vercel Postgres)
- Login multi-user (NextAuth.js)
- Export chat ke PDF/TXT
- Pencarian riwayat chat
- Shortcut keyboard (Ctrl+K, Ctrl+N)

<div align="center">
Built with 🚀 by ZAIDANITY
</div>
<div align="center">
© 2026 ZDN1SM. All rights reserved.
</div>
