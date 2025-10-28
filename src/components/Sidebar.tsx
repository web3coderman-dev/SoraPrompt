import { Sparkles, History, Settings, Menu, X, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import NavLinkItem from './Sidebar/NavLinkItem';
import UserProfile from './Sidebar/UserProfile';
import SidebarHeader from './Sidebar/SidebarHeader';
import LoginPrompt from './Sidebar/LoginPrompt';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: Sparkles,
      label: t.sidebarNew,
      path: '/new',
    },
    {
      icon: History,
      label: t.sidebarHistory,
      path: '/history',
    },
    {
      icon: CreditCard,
      label: t.sidebarSubscription,
      path: '/subscription',
    },
    {
      icon: Settings,
      label: t.sidebarSettings,
      path: '/settings',
    },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-overlay-medium z-overlay lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-hud lg:hidden bg-scene-fill p-2 rounded-lg shadow-depth-lg border border-keyLight/20"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-text-primary" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-scene-fill border-r border-keyLight/20 z-modal transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarHeader />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLinkItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              onClick={handleNavClick}
              collapsed={sidebarCollapsed}
            />
          ))}

          {/* Collapse Toggle Button - Desktop Only */}
          <div className="hidden lg:block pt-4 mt-4 border-t border-keyLight/10">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-scene-fillLight border border-keyLight/5 hover:border-keyLight/10 transition-all duration-200 group"
              title={sidebarCollapsed ? t.expandSidebar || 'Expand Sidebar' : t.collapseSidebar || 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">{t.collapseSidebar || 'Collapse'}</span>
                </>
              )}
            </button>
          </div>
        </nav>

        {/* User Profile & Footer */}
        <div className="border-t border-keyLight/20">
          {user ? (
            <UserProfile />
          ) : (
            <LoginPrompt onLogin={() => setShowLoginModal(true)} />
          )}
        </div>
      </aside>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
