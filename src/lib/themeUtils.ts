export const themeColors = {
  getCurrentBackground: () =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-scene-bg').trim(),

  getCurrentFill: () =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-scene-fill').trim(),

  getCurrentFillLight: () =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-scene-fillLight').trim(),

  getCurrentTextPrimary: () =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim(),

  getCurrentTextSecondary: () =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim(),
};

export const getThemeAwareClasses = (theme: 'light' | 'dark') => ({
  card: theme === 'light'
    ? 'bg-white border-gray-200 shadow-sm'
    : 'bg-scene-fill border-keyLight/20 shadow-depth-md',

  input: theme === 'light'
    ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
    : 'bg-scene-fillLight border-keyLight/20 text-text-primary placeholder-text-secondary',

  button: theme === 'light'
    ? 'bg-keyLight hover:bg-keyLight-600 text-white'
    : 'bg-keyLight hover:bg-keyLight-600 text-white',

  secondaryButton: theme === 'light'
    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
    : 'bg-scene-fillLight hover:bg-scene-fill text-text-primary border border-keyLight/20',
});

export const themeTransition = 'transition-colors duration-300 ease-in-out';

export const glassmorphism = (theme: 'light' | 'dark') =>
  theme === 'light'
    ? 'bg-white/80 backdrop-blur-md border border-gray-200/50'
    : 'bg-scene-fill/80 backdrop-blur-md border border-keyLight/10';
