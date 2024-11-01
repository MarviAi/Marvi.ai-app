/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#F5F5F5',
        accent: '#DAFF00',
        background: '#FFFFFF',
        text: '#333333',
        'text-secondary': '#6f7782',
      },
      fontFamily: {
        sans: ['Ubuntu', 'Helvetica', 'Arial', 'sans-serif'],
        'rubik-mono': ['"Rubik Mono One"', 'sans-serif'],
      },
      fontSize: {
        'hero-title': ['3rem', { lineHeight: '1.2' }],
        'section-heading': ['1.875rem', { lineHeight: '1.3' }],
        'subheading': ['1.5rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [],
};