/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{html,js,ts,vue}',
  './src/widgets/**/*.{html,ts,js,vue}',
  './*.{html,js,ts,vue}'
]
export const theme = {
  extend: {
    screens: {
      xs: '375px'
    }
  }
}
export const plugins = []
