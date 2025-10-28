import { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface NavLinkItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function NavLinkItem({ to, icon: Icon, label, onClick }: NavLinkItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        group relative
        w-full flex items-center gap-3 px-4 py-3
        rounded-lg transition-all duration-200
        border font-medium
        ${
          isActive
            ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
            : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-keyLight/5 hover:border-keyLight/10'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="truncate flex-1 text-left">{label}</span>

          {/* Hover light effect */}
          <div className="
            absolute inset-0 rounded-lg
            bg-keyLight opacity-0 group-hover:opacity-5
            transition-opacity duration-200
            pointer-events-none
          " />
        </>
      )}
    </NavLink>
  );
}
