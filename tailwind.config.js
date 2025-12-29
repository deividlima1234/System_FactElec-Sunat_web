/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935', // Main Red
          dark: '#B71C1C',
          light: '#FFEBEE',
        },
        background: {
          DEFAULT: '#121212', // Dark background
          paper: '#1E1E1E',   // Slightly lighter for cards in dark mode
        },
        surface: {
          DEFAULT: '#FFFFFF', // High contrast white for cards/tables
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0BEC5',
          dark: '#121212', // For clean white backgrounds
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
