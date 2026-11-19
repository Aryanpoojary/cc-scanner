/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"Manrope"', "sans-serif"],
      },
      colors: {
        primary: { DEFAULT: "#EA5A2A", light: "#F47B45", dark: "#C9461B" },
        sage: "#7A9A6B",
        canvas: "#E8E4DE",
        ink: "#2B2825",
        muted: "#786F66",
        danger: "#D64545",
        success: "#2F9E6E",
      },
      borderRadius: { card: "20px" },
      boxShadow: {
        neu: "9px 9px 20px rgba(170,159,145,.55), -9px -9px 20px rgba(255,255,255,.85)",
        "neu-sm": "5px 5px 11px rgba(170,159,145,.5), -5px -5px 11px rgba(255,255,255,.85)",
        "neu-in": "inset 4px 4px 9px rgba(170,159,145,.55), inset -4px -4px 9px rgba(255,255,255,.9)",
        glow: "0 12px 26px -10px rgba(234,90,42,.65)",
      },
    },
  },
  plugins: [],
};
