export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#00ccff',
        accent: '#ff6b35'
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 204, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 102, 204, 0.6)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '1000% 0' },
          '100%': { backgroundPosition: '-1000% 0' }
        }
      },
      backdropFilter: {
        blur: 'blur(10px)'
      }
    }
  },
  plugins: []
};
