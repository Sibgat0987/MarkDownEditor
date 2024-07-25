/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        // Adding custom max-width breakpoint
        'max-ph': {'max': '480px'}, // Apply styles for screen sizes up to 480px
      },
    },
  },
  plugins: [],
}
