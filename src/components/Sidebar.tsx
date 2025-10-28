import { Sparkles, History, Settings, Menu, X, CreditCard } from 'lucide-react';
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
  const { sidebarCollapsed } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
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
        className={`fixed top-0 left-0 h-screen bg-scene-background border-r border-default shadow-depth-md z-modal ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          minWidth: sidebarCollapsed ? '5rem' : '16rem',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-in-out',
        }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <SidebarHeader isHovered={isSidebarHovered} />

        {/* Navigation */}
        <nav
          className="flex-1 p-4 overflow-y-auto overflow-x-hidden"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            gap: '0.5rem',
          }}
        >
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
        </nav>

        {/* User Profile & Footer */}
        <div className="border-t border-default">
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
