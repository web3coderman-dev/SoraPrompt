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
        border font-medium flex-shrink-0
        ${collapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'}
        ${
          isActive
            ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
            : 'bg-scene-fill text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-subtle hover:border-default'
        }
      `}
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        minHeight: '44px',
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
        className="truncate text-left whitespace-nowrap"
        style={{
          display: collapsed ? 'none' : 'block',
          flex: collapsed ? '0 0 0' : '1 1 auto',
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
          overflow: 'hidden',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
