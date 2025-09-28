/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This line tells Tailwind to scan all your component files for class names
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can add custom theme extensions here if needed
    },
  },
  plugins: [
    require('@tailwindcss/forms'), 
  ],
}
