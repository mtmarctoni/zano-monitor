import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Updated colors based on globals.css
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				bg: {
					primary: "var(--bg-primary)",
					secondary: "var(--bg-secondary)",
					tertiary: "var(--bg-tertiary)",
					terminal: "var(--bg-terminal)",
				},
				text: {
					primary: "var(--text-primary)",
					secondary: "var(--text-secondary)",
					dim: "var(--text-dim)",
					terminal: "var(--text-terminal)",
				},
				matrix: {
					green: "var(--matrix-green)",
					"green-dim": "var(--matrix-green-dim)",
					"green-dark": "var(--matrix-green-dark)",
					"green-glow": "var(--matrix-green-glow)",
				},
				cyber: {
					blue: "var(--cyber-blue)",
					purple: "var(--cyber-purple)",
					red: "var(--cyber-red)",
					orange: "var(--cyber-orange)",
				},
				sidebar: {
					background: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;