import { Logo } from '../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarHeaderProps {
  isHovered?: boolean;
}

export default function SidebarHeader({ isHovered = false }: SidebarHeaderProps) {
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const { t } = useLanguage();

  if (sidebarCollapsed) {
    return (
      <div className="p-6 border-b border-keyLight/20 transition-all duration-300 px-4 relative">
        {/* Mobile: Entire area clickable */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-full flex items-center justify-center py-2 active:scale-95 transition-transform"
          title={t.expandSidebar || 'Expand Sidebar'}
        >
          <Logo size={32} className="flex-shrink-0" />
        </button>

        {/* Desktop: Logo only */}
        <div className="hidden lg:flex items-center justify-center">
          <Logo size={32} className="flex-shrink-0" />
        </div>

        {/* Desktop: Hover button */}
        <button
          onClick={toggleSidebar}
          className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-text-secondary hover:text-text-primary hover:bg-scene-fillLight/80 backdrop-blur-sm transition-all duration-300 absolute right-2 top-1/2 -translate-y-1/2 shadow-sm ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
          }`}
          title={t.expandSidebar || 'Expand Sidebar'}
          style={{
            transitionProperty: 'opacity, transform, background-color',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-keyLight/20 transition-all duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <Logo size={32} className="flex-shrink-0" />
        <h2 className="text-xl font-bold font-display text-text-primary whitespace-nowrap flex-1">
          SoraPrompt
        </h2>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-text-secondary hover:text-text-primary hover:bg-scene-fillLight transition-all duration-200 flex-shrink-0"
          title={t.collapseSidebar || 'Collapse Sidebar'}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
