
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
      textShadow: {
        'xs': '0 1px 1px rgba(0, 0, 0, 0.15)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.25)',
        'lg': '0 4px 8px rgba(0, 0, 0, 0.3)',
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "wakti-blue": "#0053c3",
        "wakti-gold": "#ffc529",
        "wakti-navy": "#000080",
        "wakti-beige": "#F5E6D3",
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
        cardPulse: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(66, 153, 225, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(66, 153, 225, 0.7)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-in": "slideIn 0.5s ease-in-out forwards",
        "card-pulse": "cardPulse 3s infinite ease-in-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    headlessui,
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-xs': {
          textShadow: '0 1px 1px rgba(0, 0, 0, 0.15)',
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;

export default config;
