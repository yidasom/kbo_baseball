/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "kbo-blue": "#004a80",
        "kbo-red": "#c70125",
        "kbo-green": "#0a8a43",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
