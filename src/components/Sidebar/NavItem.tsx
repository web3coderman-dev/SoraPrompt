import { LucideIcon } from 'lucide-react';

type StatusType = 'active' | 'processing' | 'idle' | null;

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  status?: StatusType;
}

export default function NavItem({ icon: Icon, label, active, onClick, status = null }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative
        w-full flex items-center gap-3 px-4 py-3
        rounded-lg transition-all duration-200
        border font-medium
        ${
          active
            ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
            : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-keyLight/5 hover:border-keyLight/10'
        }
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate flex-1 text-left">{label}</span>

      {/* Status Indicator */}
      {status && (
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            status === 'active' ? 'bg-state-ok animate-light-blink' :
            status === 'processing' ? 'bg-neon animate-render-pulse' :
            'bg-text-tertiary'
          }`}
        />
      )}

      {/* Hover light effect */}
      <div className="
        absolute inset-0 rounded-lg
        bg-keyLight opacity-0 group-hover:opacity-5
        transition-opacity duration-200
        pointer-events-none
      " />
    </button>
  );
}
