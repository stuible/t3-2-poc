import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      'white': 'white',
      'black': 'black',
      'red': '#F36B6A',
      'green': '#39DB76',
      'blue': {
        lightest: '#dfe2f3',
        lighter: '#9AA8ED',
        DEFAULT: '#2F4AB4',
      },
      // 'purple': '#7e5bef',
      // 'pink': '#ff49db',
      // 'orange': '#ff7849',
      // 'green': '#13ce66',
      // 'yellow': '#ffc82c',

      'gray': {
        light: '#d1d5db',
        DEFAULT: '#6b7280',
        dark: '#1f2937',
      },

    },
    fontFamily: {
      // sans: ['Graphik', 'sans-serif'],
      // serif: ['Merriweather', 'serif'],
    },
    extend: {
      borderRadius: {

      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
