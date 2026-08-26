/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러 — 초록(emerald)에서 카레 옐로우로 변경
        curry: {
          50: '#FBF4E7',
          100: '#F5E7CB',
          300: '#DDB36B',
          400: '#C98A3C',
          500: '#B36F1F',
          600: '#854D0E',
          700: '#6B3D0A',
          900: '#3D2204',
          950: '#241402',
        },
      },
    },
  },
  plugins: [],
}
