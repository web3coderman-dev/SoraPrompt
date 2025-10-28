import { Logo } from '../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';

export default function SidebarHeader() {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className={`p-6 border-b border-keyLight/20 transition-all duration-300 ${sidebarCollapsed ? 'px-4' : ''}`}>
      <div className={`flex items-center min-w-0 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
        <Logo size={32} className="flex-shrink-0" />
        {!sidebarCollapsed && (
          <h2 className="text-xl font-bold font-display text-text-primary whitespace-nowrap">
            SoraPrompt
          </h2>
        )}
      </div>
    </div>
  );
}
