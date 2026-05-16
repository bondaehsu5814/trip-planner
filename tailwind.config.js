/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pending: {
          bg: '#FAEEDA',
          text: '#633806',
          border: '#FAC775',
        },
        booked: {
          bg: '#EAF3DE',
          text: '#27500A',
          border: '#C0DD97',
        },
        inspiration: {
          primary: '#534AB7',
          light: '#EEEDFE',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      maxWidth: {
        app: '480px',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
