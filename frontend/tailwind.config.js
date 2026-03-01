/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          'dusty-blue': '#5E81AC',
          'soft-sky': '#88C0D0',
        },
        secondary: {
          'sage-green': '#A3BE8C',
          'olive-accent': '#6B8E23',
        },
        background: {
          'warm-off-white': '#F8F9F6',
          'light-sand': '#F1F3EE',
        },
        accent: {
          'muted-coral': '#E07A5F',
          'warm-grey': '#4C566A',
        },
        text: {
          default: '#4C566A',
        },
      },
    },
  },
  plugins: [],
};
