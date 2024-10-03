const themeColors = {
  primary: '#b68f40',    // Теплый золотисто-коричневый
  secondary: '#52796f',  // Глубокий зеленовато-серый (создаёт ощущение спокойствия)
  error: '#d62828',      // Чистый красный для ошибок
  info: '#4090cc',       // Мягкий голубой для информации
  success: '#74c69d',    // Светло-зеленый для успеха
  warning: '#f4a261',    // Теплый оранжевый для предупреждений
}

export const dark = {
  dark: true,
  colors: {
    ...themeColors,
    'primary-darken': '#8c5723',       // Темный золотистый
    'primary-darken-1': '#5b3a1d',     // Темно-коричневый
    background: '#121212',             // Очень темный фон
    surface: '#1f2933',                // Чуть светлее для элементов
    appBar: '#004f73',                 // Темный синий для панели
  },
}

export const light = {
  dark: false,
  colors: {
    ...themeColors,
    'primary-darken': '#d4743f',       // Темный оранжевый для яркости
    'primary-darken-1': '#c8553d',     // Более глубокий оттенок красного
    background: '#fafafa',             // Светлый, но не чисто белый фон
    surface: '#e0e0e0',                // Светлый серый для элементов
    appBar: '#e6f2f6',                 // Светло-голубой для панели
  },
}
