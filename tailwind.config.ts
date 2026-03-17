import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        success: "var(--success)",
        warning: "var(--warning)",
        cyan: "var(--gold)",
        navy: "var(--navy)",
        indigo: {
          400: "var(--indigo-400)",
          500: "var(--indigo-500)",
          800: "var(--indigo-800)",
          900: "var(--indigo-900)",
          950: "var(--indigo-950)",
        },
        magenta: "var(--primary)",
        violet: "#7C3AED",
        "electric-blue": "#3B82F6",
        glow: "var(--primary)",
        "gradient-start": "var(--primary)",
        "gradient-end": "var(--indigo-500)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "card-enter": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "1" },
          "50%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(0.95)", opacity: "1" },
        },
        "score-fill": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--score-offset)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(217, 70, 239, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(217, 70, 239, 0.4)" },
        },
        "flicker": {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "0.99",
            textShadow: "0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #D946EF, 0 0 80px #D946EF, 0 0 90px #D946EF, 0 0 100px #D946EF, 0 0 150px #D946EF",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
            textShadow: "none",
          },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "card-enter": "card-enter 0.4s ease-out",
        "pulse-ring": "pulse-ring 2s ease-in-out infinite",
        "score-fill": "score-fill 1.5s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "flicker": "flicker 1.5s infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
