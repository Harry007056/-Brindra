/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          'dusty-blue': '#5E81AC',
          'soft-sky': '#88C0D0',
          'dusty-blue-dark': '#8FBCBB',
          'soft-sky-dark': '#A3BE8C',
        },
        secondary: {
          'sage-green': '#A3BE8C',
          'olive-accent': '#6B8E23',
          'sage-green-dark': '#5E7173',
          'olive-accent-dark': '#4C566A',
        },
        background: {
          'warm-off-white': '#F8F9F6',
          'light-sand': '#F1F3EE',
          'warm-off-white-dark': '#182235',
          'light-sand-dark': '#22314A',
        },
        accent: {
          'muted-coral': '#E07A5F',
          'warm-grey': '#4C566A',
          'muted-coral-dark': '#BF616A',
          'warm-grey-dark': '#E6EDF7',
        },
        text: {
          default: '#4C566A',
          'default-dark': '#E6EDF7',
        },
      },
    },
  },
  plugins: [],
};
