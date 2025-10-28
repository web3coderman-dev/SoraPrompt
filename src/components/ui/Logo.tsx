interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <img
      src="/assets/soraprompt-logo.png"
      alt="SoraPrompt Studio Logo"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      style={{ aspectRatio: '1 / 1' }}
    />
  );
}
