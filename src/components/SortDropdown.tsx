import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check } from 'lucide-react';

type SortOption = {
  value: string;
  label: string;
};

type SortDropdownProps = {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function SortDropdown({ options, value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-keyLight/20 rounded-lg hover:border-keyLight/40 focus:ring-2 focus:ring-keyLight/20 focus:border-transparent bg-scene-fill text-text-secondary transition-all duration-300 min-w-[140px] justify-between active:scale-[0.98]"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-text-tertiary" />
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-scene-fill rounded-lg shadow-depth-lg border border-keyLight/20 py-1 z-50 animate-scale-in">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-scene-fillLight flex items-center justify-between transition-colors duration-300 ${
                value === option.value ? 'bg-keyLight/10 text-keyLight' : 'text-text-secondary'
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="w-4 h-4 text-keyLight" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
