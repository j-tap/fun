const themeColors = {
  primary: '#9f66ff',    // Теплый золотисто-коричневый
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
    'primary-darken': '#4032b8',       // Темный золотистый
    'primary-darken-1': '#471a95',     // Темно-коричневый
    background: '#121212',             // Очень темный фон
    surface: '#1f2933',                // Чуть светлее для элементов
    appBar: '#004f73',                 // Темный синий для панели
  },
}

export const light = {
  dark: false,
  colors: {
    ...themeColors,
    'primary-darken': '#5a3cc6',       // Темный оранжевый для яркости
    'primary-darken-1': '#4d28ac',     // Более глубокий оттенок красного
    background: '#fafafa',             // Светлый, но не чисто белый фон
    surface: '#e0e0e0',                // Светлый серый для элементов
    appBar: '#e6f2f6',                 // Светло-голубой для панели
  },
}
