/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0A0E14',
        surface: '#131A24',
        'surface-raised': '#1B2430',
        border: '#1F2937',
        foreground: '#E6EDF3',
        muted: '#8B949E',
        bull: '#34D399',
        bear: '#F87171',
        accent: '#10B981',
      },
      fontFamily: {
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
