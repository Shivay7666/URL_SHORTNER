/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'w-full', 'p-3', 'p-8', 'border', 'border-gray-400', 'rounded-lg', 'mb-4', 'mb-6',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-400',
    'bg-blue-600', 'bg-gray-50', 'text-white', 'py-3', 'hover:bg-blue-700',
    'transition', 'duration-300', 'max-w-lg', 'mx-auto', 'shadow-md',
    'text-3xl', 'font-extrabold', 'text-gray-800', 'text-blue-600',
    'underline', 'hover:text-blue-800'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};