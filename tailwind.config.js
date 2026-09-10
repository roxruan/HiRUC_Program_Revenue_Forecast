/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A2B3C',
        sand: '#F0F4F8',
        'sand-dim': '#E2EAF0',
        pacific: '#2C4A6B',
        reef: '#3D6B8E',
        lava: '#B5563B',
        gold: '#5B8BAE',
        line: '#D0DCE5',
        mint: '#A8C4D8',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        data: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        '14': '14px',
      },
    },
  },
  plugins: [],
};
