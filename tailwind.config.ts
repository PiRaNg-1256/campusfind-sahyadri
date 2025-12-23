import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",

                primary: {
                    DEFAULT: "#003366",
                    light: "#004c99",
                    dark: "#001a33",
                },

                secondary: {
                    DEFAULT: "#FFCC00",
                    light: "#ffdb4d",
                    dark: "#e6b800",
                },

                /* ✅ MISSING TOKENS (THIS FIXES THE ERROR) */
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
            },

            borderRadius: {
                lg: "0.5rem",
                md: "0.375rem",
                sm: "0.25rem",
            },

            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
