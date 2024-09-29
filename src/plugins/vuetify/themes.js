const themeColors = {
  primary: '#e07d26',
  secondary: '#46537a',
  error: '#b75280',
  info: '#7d568b',
  success: '#007c43',
  warning: '#dd5b5b',
}
export const dark = {
  dark: true,
  colors: {
    ...themeColors,
    'primary-darken': '#8c0000',
    'primary-darken-1': '#520000',
    background: '#101315',
    surface: '#1c2a33',

    appBar: '#034a75',
  },
}

export const light = {
  dark: false,
  colors: {
    ...themeColors,
    'primary-darken': '#d73300',
    'primary-darken-1': '#b10000',
    background: '#ffffff',
    surface: '#f3f3f3',

    appBar: '#d7eaf6',
  },
}
