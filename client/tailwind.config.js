module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        themeNavy: '#1a2744',
        themePalePink: '#fef3ed',
        themeMidBlue: '#6b9bc4',
        themeMidPink: '#d9617d',
        themeOrange: '#dc8727',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
