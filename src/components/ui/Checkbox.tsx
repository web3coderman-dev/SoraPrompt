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
          mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-300
          ${
            checked
              ? 'bg-keyLight border-keyLight'
              : error
              ? 'bg-transparent border-stateError'
              : 'bg-transparent border-borderDefault hover:border-keyLight'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-keyLight focus:ring-offset-2 focus:ring-offset-sceneBackground
        `}
      >
        {checked && (
          <Check className="w-full h-full text-white p-0.5" strokeWidth={3} />
        )}
      </button>
      {label && (
        <label
          htmlFor={id}
          className={`
            flex-1 text-sm leading-relaxed cursor-pointer select-none
            ${error ? 'text-stateError' : 'text-text-secondary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  );
}
