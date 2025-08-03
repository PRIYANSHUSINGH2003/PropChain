/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14b8a6', // teal-500
        primaryDark: '#0f766e',   // teal-800
        primaryLight: '#5eead4',  // teal-300
        accent: '#fbbf24', // gold-400
        accentDark: '#b45309',   // gold-800
        secondary: '#3b82f6', // blue-500
        secondaryDark: '#1e40af',   // blue-800
        glass: 'rgba(255,255,255,0.7)',
        darkglass: 'rgba(17,24,39,0.7)',
        softgray: '#f3f4f6',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        primary: '#14b8a6',
        secondary: '#3b82f6',
        accent: '#fbbf24',
      }),
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        card: '0 4px 24px 0 rgba(20,184,166,0.10)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        display: ['Geist', 'Inter', 'Poppins', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s cubic-bezier(0.4,0,0.2,1) both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
