/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a7ea4',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        muted: '#687076',
        foreground: '#11181C',
        background: '#ffffff',
        surface: '#f5f5f5',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}
