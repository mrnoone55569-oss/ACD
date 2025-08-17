/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium dark purple theme
        'base-dark': '#1A102D',      // Deep royal purple (primary)
        'darker': '#0D0B14',         // Near-black charcoal (background)
        'panel': '#1F1535',          // Slightly lighter purple for panels
        'highlight': '#2A1F3D',      // Subtle highlight purple
        'accent-primary': '#A36EFF', // Muted violet (main accent)
        'accent-secondary': '#8B5CF6', // Secondary violet
        'accent-light': '#C4B5FD',   // Light violet for subtle elements
        'text-primary': '#E5E5E5',   // Soft white text
        'text-secondary': '#B8B8B8', // Muted gray text
        'text-muted': '#8A8A8A',     // Very muted text
        // Tier colors (keeping original for consistency)
        'ht1': '#f59e0b',
        'lt1': '#d97706',
        'ht2': '#60a5fa',
        'lt2': '#3b82f6',
        'ht3': '#a78bfa',
        'lt3': '#8b5cf6',
        'ht4': '#34d399',
        'lt4': '#10b981',
        'ht5': '#fb7185',
        'lt5': '#e11d48',
      },
      fontFamily: {
        'game': ['Rajdhani', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'tier': '0 0 10px rgba(163, 110, 255, 0.1)',
        'purple-glow': '0 0 20px rgba(163, 110, 255, 0.3)',
        'accent-glow': '0 0 20px rgba(163, 110, 255, 0.4)',
        'subtle-glow': '0 0 15px rgba(163, 110, 255, 0.2)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #1A102D 0%, #0D0B14 100%)',
        'accent-gradient': 'linear-gradient(135deg, #A36EFF 0%, #8B5CF6 100%)',
        'panel-gradient': 'linear-gradient(135deg, #1F1535 0%, #1A102D 100%)',
      },
    },
  },
  plugins: [],
};