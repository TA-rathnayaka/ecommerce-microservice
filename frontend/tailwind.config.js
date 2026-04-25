/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        ink: "#1C1F2A",
        clay: "#F7F0E8",
        ember: "#E85D04",
        moss: "#3A7D44",
        aqua: "#1D7874",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(28, 31, 42, 0.12)",
      },
      animation: {
        floatIn: "floatIn 400ms ease-out",
        rise: "rise 500ms ease-out",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
