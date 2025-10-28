interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <img
      src="/soraprompt-logo.svg"
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
