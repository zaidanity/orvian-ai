/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        deepseek: {
          bg: '#0f0f0f',
          card: '#1a1a1a',
          border: '#2a2a2a',
          primary: '#3b82f6',
          secondary: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}
