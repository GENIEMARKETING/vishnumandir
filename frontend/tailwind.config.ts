import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Palette
        primary: "#EA580C", // Saffron (Agni)
        secondary: "#0F766E", // Peacock (Krishna)
        accent: "#F59E0B", // Marigold (Gold)

        // Neutral Palette
        background: "#FFFBEB", // Sandalwood (Cream)
        "text-primary": "#451a03", // Earth (Deep Brown)
        "text-secondary": "#6b7280", // Medium Gray
        border: "#e5e7eb", // Light Gray

        // Semantic Palette
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626",

        // New UI Theme Colors
        "temple-red": "#8B2E0F",
        "temple-orange": "#D97706",
        "temple-cream": "#FDFBF7",
        "temple-gold": "#C5A059",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        sm: "0 2px 4px rgb(0 0 0 / 0.05)",
        md: "0 4px 10px rgb(0 0 0 / 0.08)",
        lg: "0 10px 20px rgb(0 0 0 / 0.08)",
        warm: "0 10px 15px -3px rgba(234, 88, 12, 0.1), 0 4px 6px -2px rgba(234, 88, 12, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
