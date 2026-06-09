/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        glass: 'rgba(255,255,255,0.08)',
        'blue-deep': '#0B1E3F',
        'blue-mid': '#1A3A6B',
        'blue-electric': '#2D7DD2',
        'green-bank': '#00C896',
        'red-alert': '#FF4D6D',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3)',
        'glass-hover': '0 12px 40px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}