import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#d6eaf0",
        surface: "rgba(255,255,255,0.38)",
        accent: "#00d4ff",
        text: "#1a3a45",
        muted: "#5a8a9a",
      },
    },
  },
} satisfies Config;
