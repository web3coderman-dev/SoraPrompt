import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-md bg-scene-fillLight hover:bg-scene-fill
                 text-text-secondary hover:text-text-primary
                 transition-all duration-300 active:scale-95
                 overflow-hidden group"
      aria-label={t['ui.themeToggle'] || 'Toggle theme'}
      title={theme === 'light' ? t['ui.darkMode'] || 'Dark mode' : t['ui.lightMode'] || 'Light mode'}
    >
      <div className="relative">
        {theme === 'light' ? (
          <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        )}
      </div>
    </button>
  );
}
