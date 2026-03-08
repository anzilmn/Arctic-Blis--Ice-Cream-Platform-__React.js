/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        icePrimary: "#FF9AA2",
        iceSecondary: "#B5EAD7",
        iceAccent: "#FFDAC1",
        iceDark: "#4A4A4A", // ✅ We'll use this for dark text
        // Removed darkBg/darkCard for light theme
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      // ✅ ADD THIS FOR GLOBAL TEXT COLOR
      textColor: {
        DEFAULT: "#4A4A4A", // Set default text to iceDark
      },
    },
  },
  plugins: [],
};