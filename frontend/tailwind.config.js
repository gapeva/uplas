/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          dark: '#357ABD',
          light: '#8DB9ED',
          ultralight: 'rgba(74, 144, 226, 0.1)',
        },
        secondary: {
          DEFAULT: '#50E3C2',
          dark: '#3BAA90',
          light: '#88F1D6',
        },
        accent: {
          DEFAULT: '#F5A623',
          dark: '#D4880B',
          light: '#F8C56E',
        },
        success: {
          DEFAULT: '#28a745',
          light: 'rgba(40, 167, 69, 0.1)',
        },
        error: {
          DEFAULT: '#D0021B',
          light: 'rgba(208, 2, 27, 0.1)',
        },
        dark: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          panel: '#21262d',
          border: '#30363d',
          text: '#c9d1d9',
          'text-secondary': '#8b949e',
        },
        light: {
          bg: '#f7f9fc',
          card: '#ffffff',
          border: '#dfe6f0',
          text: '#2c3e50',
          'text-secondary': '#7f8c8d',
        },
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(2.0rem, 5.5vw, 3.3rem)',
      },
      spacing: {
        'header': '70px',
        'header-mobile': '60px',
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 2px 5px rgba(44, 62, 80, 0.06)',
        'md': '0 5px 12px -1px rgba(44, 62, 80, 0.08), 0 3px 7px -2px rgba(44, 62, 80, 0.05)',
        'lg': '0 12px 20px -3px rgba(44, 62, 80, 0.1), 0 5px 8px -4px rgba(44, 62, 80, 0.06)',
        'focus': '0 0 0 3px rgba(74, 144, 226, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
