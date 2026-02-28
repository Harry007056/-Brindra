export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        bg: 'var(--color-background)',
        'bg-alt': 'var(--color-background-alt)'
      },
      fontFamily: {
        inter: ['Inter','sans-serif']
      }
    }
  },
  plugins: []
};