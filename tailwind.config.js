/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3A49A4',
          pink: '#E830B0',
          light: '#EBEDF6',
        },
        secondary: {
          light: '#FDEAF7',
        },
        neutral: {
          gray: '#777',
          dark: '#333',
          lightgray: '#D2D2D2',
          placeholder: '#D2D2D2',
        },
        error: '#D00416',
        success: '#1FC16B',
        // Dark mode colors
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          card: '#334155',
          text: '#F8FAFC',
          textSecondary: '#CBD5E1',
          border: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        times: ['Times New Roman', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-up': 'slideInUp 0.8s ease-out forwards',
        'slide-in-down': 'slideInDown 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s ease-out forwards',
        'stagger-fade-in': 'staggerFadeIn 0.8s ease-out forwards',
        'modal-fade-in': 'modalFadeIn 0.4s ease-out forwards',
        'modal-slide-up': 'modalSlideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'toast-slide-in': 'toastSlideIn 0.5s ease-out forwards',
        'checkmark': 'checkmark 0.6s ease-in-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          from: { opacity: '0', transform: 'translateY(-30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          from: { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        staggerFadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalFadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        modalSlideUp: {
          from: { opacity: '0', transform: 'translateY(50px) scale(0.9)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastSlideIn: {
          from: { opacity: '0', transform: 'translateX(100px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        checkmark: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'soft': '0 0 4px 0 rgba(0, 0, 0, 0.20)',
        'large': '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
        'toast': '0 3px 5px 0 rgba(0, 0, 0, 0.20), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12)',
        'dark-soft': '0 0 4px 0 rgba(0, 0, 0, 0.40)',
        'dark-large': '0 8px 25px 0 rgba(0, 0, 0, 0.30)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
