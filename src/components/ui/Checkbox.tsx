import { Check } from 'lucide-react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  error = false,
  className = '',
}: CheckboxProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        id={id}
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2
          transition-all duration-300 ease-smooth
          ${
            checked
              ? 'bg-keyLight border-keyLight shadow-light scale-105'
              : error
              ? 'bg-transparent border-state-error'
              : 'bg-transparent border-border-default hover:border-keyLight hover:shadow-light'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyLight/50 focus-visible:ring-offset-2 focus-visible:ring-offset-scene-bg
          active:scale-95
        `.trim().replace(/\s+/g, ' ')}
      >
        {checked && (
          <Check
            className="w-full h-full text-white p-0.5 animate-scale-in"
            strokeWidth={3}
          />
        )}
      </button>
      {label && (
        <label
          htmlFor={id}
          className={`
            flex-1 text-sm leading-relaxed cursor-pointer select-none
            transition-colors duration-200
            ${error ? 'text-state-error' : 'text-text-secondary'}
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-text-primary'}
          `.trim().replace(/\s+/g, ' ')}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  );
}
