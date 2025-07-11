// File: frontend/tailwind.config.js
// Path: /inviter-app/frontend/tailwind.config.js
// Description: Tailwind CSS configuration

module.exports = {
  darkMode: 'class', // Enable dark mode with class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}