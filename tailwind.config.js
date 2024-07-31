/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ["Kanit", "sans-serif"],
        'kanit': ["Kanit", "sans-serif"],
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        spin: {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      },
      animation: {
        fadeInDown: 'fadeInDown 0.25s ease-in-out forwards',
        spin: 'spin 1s linear infinite' // Corrected animation name to 'spin' here
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};