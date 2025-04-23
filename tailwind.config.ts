import { fontFamily } from "tailwindcss/defaultTheme";
import { type Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// Attempt to import headlessui, but don't fail if it's not available
let headlessui;
try {
  headlessui = require("@headlessui/tailwindcss");
} catch (e) {
  // Package not available, use a dummy plugin
  headlessui = () => ({ handler: () => {} });
}

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        redrose: ['Red Rose', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Pastel and artful custom colors extracted from src/index.css */
        "light-pink": "#FFECF5",
        "light-purple": "#EEEAFE",
        "light-blue": "#EAF1FE",
        "off-white": "#F5F7FA",
        "dark-purple": "#2e204b",
        "deep-blue": "#263145",
        "sidebar-dark": "#231935"
      },
      backgroundImage: {
        "dash-gradient": "linear-gradient(120deg, #FFECF5 0%, #EAF1FE 100%)",
        "dash-gradient-dark": "linear-gradient(120deg, #2e204b 0%, #2d3753 100%)",
        "card-gradient-light": "linear-gradient(135deg, #FFECF5 0%, #EEEAFE 50%, #E9F3FE 100%)",
        "card-gradient-dark": "linear-gradient(135deg, #2e204b 0%, #462d58 45%, #263145 100%)",
        "sidebar-gradient-light": "linear-gradient(120deg, #FDEFFC 40%, #EAF1FE 100%)",
        "sidebar-gradient-dark": "linear-gradient(120deg, #231935 40%, #2d3753 100%)"
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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-in": "slideIn 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate, headlessui],
}
export default config;
