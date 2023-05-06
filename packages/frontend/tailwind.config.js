module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      screens: {
        short: { raw: "(max-height: 719px)" },
        tall: { raw: "(min-height: 720px)" },
      },
    },
  },
  plugins: [],
};
