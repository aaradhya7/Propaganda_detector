/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark/Neon theme tokens
        'surface-container-low': '#181a1b',
        'surface-container': '#1e2123',
        'surface-container-high': '#23272a',
        'surface-container-highest': '#262a2e',
        'primary': '#73ffe3',
        'primary-dim': '#00f5d4',
        'on-primary': '#181a1b',
        'on-surface': '#fff',
        'on-surface-variant': '#bfc9cf',
        'outline': '#2c2f31',
        'outline-variant': '#23272a',
        'error': '#e53935',
        'error-dim': '#ffb4ab',
        'error-container': '#2d1517',
        'on-error-container': '#ffb4ab',
        'tertiary': '#7c4dff',
        'tertiary-fixed': '#b69df8',
        'tertiary-fixed-dim': '#eaddff',
        'background': '#101113',
        'ghost': '#23272a',
        'on-error': '#fff',
        'tertiary-container': '#23272a',
      },
    },
  },
  plugins: [],
}
