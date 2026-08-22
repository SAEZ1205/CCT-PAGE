/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: 'tw-',
  safelist: ['tw-hidden'],
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: []
};
