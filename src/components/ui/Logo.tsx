import { useTheme } from '../../contexts/ThemeContext';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'simple' | 'favicon';
  showBackground?: boolean;
}

export function Logo({ size = 32, className = '', variant = 'default', showBackground = false }: LogoProps) {
  const { theme } = useTheme();
  const logoSrc = variant === 'simple'
    ? '/soraprompt-logo-simple.svg'
    : variant === 'favicon'
    ? '/soraprompt-favicon.svg'
    : '/soraprompt-logo.svg';

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex-shrink-0 ${showBackground ? (isDark ? 'bg-scene-fillLight/10' : 'bg-scene-fillLight/5') + ' rounded-lg p-1' : ''} ${className}`}
      style={{
        width: showBackground ? size + 8 : size,
        height: showBackground ? size + 8 : size,
        minWidth: showBackground ? size + 8 : size,
        minHeight: showBackground ? size + 8 : size
      }}
    >
      <img
        src={logoSrc}
        alt="SoraPrompt Studio Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
