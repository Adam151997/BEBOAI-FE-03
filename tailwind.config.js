/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Original shadcn/ui colors (keeping for compatibility)
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
        // GROK THEME COLORS - Exact HEX values
        grok: {
          'bg-primary': '#000000',
          'bg-secondary': '#0F0F0F',
          'bg-tertiary': '#1A1A1A',
          'bg-light': '#FFFFFF',
          'text-primary': '#FFFFFF',
          'text-secondary': '#A0A0A0',
          'text-tertiary': '#6B6B6B',
          'text-dark': '#000000',
          'blue': '#1DA1F2',
          'blue-hover': '#1a8cd8',
          'blue-light': 'rgba(29, 161, 242, 0.1)',
          'orange': '#FF6B35',
          'green': '#00FF41',
          'red': '#FF0000',
          'red-light': '#FF3333',
          'border-subtle': '#333333',
          'border-medium': '#444444',
          'border-focus': '#1DA1F2',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Grok specific radii
        'grok-sm': '4px',
        'grok-md': '8px',
        'grok-lg': '12px',
        'grok-xl': '16px',
      },
      fontFamily: {
        // Grok font family - Inter
        'grok': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'grok-xs': ['0.75rem', { lineHeight: '1.5' }],    // 12px
        'grok-sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px
        'grok-base': ['1rem', { lineHeight: '1.5' }],     // 16px
        'grok-lg': ['1.125rem', { lineHeight: '1.5' }],   // 18px
        'grok-xl': ['1.25rem', { lineHeight: '1.4' }],    // 20px
        'grok-2xl': ['1.5rem', { lineHeight: '1.4' }],    // 24px
        'grok-3xl': ['2rem', { lineHeight: '1.4' }],      // 32px
        'grok-4xl': ['2.5rem', { lineHeight: '1.25' }],   // 40px
      },
      fontWeight: {
        'grok-light': '300',
        'grok-normal': '400',
        'grok-medium': '500',
        'grok-semibold': '600',
        'grok-bold': '700',
      },
      spacing: {
        'grok-xs': '4px',
        'grok-sm': '8px',
        'grok-md': '12px',
        'grok-lg': '16px',
        'grok-xl': '24px',
        'grok-2xl': '32px',
        'grok-3xl': '48px',
      },
      boxShadow: {
        'grok-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'grok-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'grok-lg': '0 8px 24px rgba(0, 0, 0, 0.2)',
        'grok-xl': '0 12px 32px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        'grok-fast': '150ms',
        'grok-base': '200ms',
        'grok-slow': '300ms',
      },
      backgroundImage: {
        'grok-gradient-primary': 'linear-gradient(135deg, #1DA1F2 0%, #00FF41 100%)',
        'grok-gradient-cosmic': 'linear-gradient(135deg, #000000 0%, #1A1A1A 50%, #000000 100%)',
      },
      letterSpacing: {
        'grok-tight': '-0.025em',
        'grok-wide': '0.025em',
      },
      maxWidth: {
        'grok-container': '1200px',
      },
    },
  },
  plugins: [],
}
