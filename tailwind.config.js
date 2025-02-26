import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      width: {
        'sm': '169px', 
        'lg': '225px',
      },
      height: {
        'sm': '336px', 
        'lg': '356px',
      },
      colors: {
        danger: '#f54242'

      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
