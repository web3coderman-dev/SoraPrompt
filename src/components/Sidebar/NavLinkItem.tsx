import { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Tooltip } from '../ui/Tooltip';

interface NavLinkItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  collapsed?: boolean;
}

export default function NavLinkItem({ to, icon: Icon, label, onClick, collapsed = false }: NavLinkItemProps) {
  const link = (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        group relative
        w-full flex items-center rounded-lg
        border font-medium
        ${collapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'}
        ${
          isActive
            ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
            : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-keyLight/5 hover:border-keyLight/10'
        }
      `}
      style={{
        transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1), gap 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s, border-color 0.2s, color 0.2s',
      }}
    >
      <Icon
        className="w-5 h-5 flex-shrink-0"
        style={{
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <span
        className="truncate flex-1 text-left whitespace-nowrap"
        style={{
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {label}
      </span>

      {/* Hover light effect */}
      <div className="
        absolute inset-0 rounded-lg
        bg-keyLight opacity-0 group-hover:opacity-5
        transition-opacity duration-200
        pointer-events-none
      " />
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} position="right">
        {link}
      </Tooltip>
    );
  }

  return link;
}
