import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--fg)",
        accent: "var(--accent)",
      },
      borderRadius: {
        theme: "var(--radius)",
      },
    },
  },
  safelist: [
    'theme-modern',
    'theme-sporty',
    'theme-minimal',
    'theme-futuristic',
    'text-blue-500',
    'text-yellow-500',
    'text-emerald-500',
    'text-purple-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-emerald-500',
    'bg-purple-500',
  ],
  plugins: [],
};
export default config;
