import React from 'react';
import { Check } from 'lucide-react';

interface OptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  showCheckmark?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  selected = false,
  children,
  icon,
  showCheckmark = true,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        p-4 rounded-lg border-2 transition-all duration-300
        ${
          selected
            ? 'border-keyLight bg-keyLight/10 text-text-primary shadow-light'
            : 'border-keyLight/20 bg-scene-fillLight text-text-secondary hover:border-keyLight/40 hover:bg-scene-fill'
        }
        active:scale-[0.98] transition-transform
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        {icon && <div className="flex items-center gap-3">{icon}</div>}
        {!icon && <span className="font-medium">{children}</span>}
        {icon && <span className="font-medium">{children}</span>}
        {showCheckmark && selected && <Check className="w-5 h-5 text-keyLight flex-shrink-0" />}
      </div>
    </button>
  );
};
