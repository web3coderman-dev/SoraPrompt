import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-keyLight via-accent to-neon shadow-key ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Sparkles
        className="text-white"
        size={size * 0.6}
        strokeWidth={2.5}
      />
    </div>
  );
}
