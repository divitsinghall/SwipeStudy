import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Swipe colors
                "swipe-right": "#10b981",
                "swipe-left": "#f43f5e",
                "swipe-save": "#fbbf24",
            },
            animation: {
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                "float": "float 3s ease-in-out infinite",
                "shimmer": "shimmer 2s infinite",
            },
            keyframes: {
                "glow-pulse": {
                    "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
                    "50%": { opacity: "0.8", transform: "scale(1.02)" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            boxShadow: {
                "card": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                "elevated": "0 40px 60px -15px rgba(0, 0, 0, 0.6)",
                "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
            },
            backdropBlur: {
                "xs": "2px",
                "glass": "20px",
            },
        },
    },
    plugins: [],
};

export default config;
