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
        w-full flex items-center rounded-lg transition-all duration-200
        border font-medium
        ${collapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'}
        ${
          isActive
            ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
            : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-keyLight/5 hover:border-keyLight/10'
        }
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="truncate flex-1 text-left">{label}</span>}

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
