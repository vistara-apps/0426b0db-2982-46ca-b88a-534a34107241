/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 80%, 50%)',
        accent: 'hsl(160, 70%, 45%)',
        bg: 'hsl(215, 20%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        textPrimary: 'hsl(220, 30%, 15%)',
        textSecondary: 'hsl(215, 15%, 40%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'full': '9999px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(220, 30%, 15%, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(220, 80%, 50%), 0 0 10px hsl(220, 80%, 50%), 0 0 15px hsl(220, 80%, 50%)' },
          '100%': { boxShadow: '0 0 10px hsl(220, 80%, 50%), 0 0 20px hsl(220, 80%, 50%), 0 0 30px hsl(220, 80%, 50%)' },
        },
      },
    },
  },
  plugins: [],
}
