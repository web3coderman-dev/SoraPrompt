interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'simple' | 'favicon';
}

export function Logo({ size = 32, className = '', variant = 'default' }: LogoProps) {
  const logoSrc = variant === 'simple'
    ? '/soraprompt-logo-simple.svg'
    : variant === 'favicon'
    ? '/soraprompt-favicon.svg'
    : '/soraprompt-logo.svg';

  return (
    <img
      src={logoSrc}
      alt="SoraPrompt Studio Logo"
      className={`flex-shrink-0 object-contain ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size
      }}
    />
  );
}
