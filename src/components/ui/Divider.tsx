import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text, className = '' }) => {
  if (!text) {
    return <div className={`border-t border-border-subtle ${className}`} />;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border-subtle"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-scene-fill text-text-tertiary">
          {text}
        </span>
      </div>
    </div>
  );
};
