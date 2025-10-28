import { Logo } from '../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SidebarHeader() {
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const { t } = useLanguage();

  if (sidebarCollapsed) {
    return (
      <div className="p-6 border-b border-keyLight/20 transition-all duration-300 px-4 relative">
        <div className="flex items-center justify-center">
          <Logo size={32} className="flex-shrink-0" />
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-text-secondary hover:text-text-primary hover:bg-scene-fillLight transition-all duration-200 absolute right-2 top-1/2 -translate-y-1/2"
          title={t.expandSidebar || 'Expand Sidebar'}
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
