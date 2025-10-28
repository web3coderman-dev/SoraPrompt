import { Sparkles, History, Settings, Menu, X, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';
import NavItem from './Sidebar/NavItem';
import UserProfile from './Sidebar/UserProfile';
import SidebarHeader from './Sidebar/SidebarHeader';
import LoginPrompt from './Sidebar/LoginPrompt';

type ViewType = 'new' | 'history' | 'settings' | 'subscription';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
};

export default function Sidebar({ isOpen, onToggle, currentView, onViewChange }: SidebarProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const menuItems = [
    {
      icon: Sparkles,
      label: t.sidebarNew,
      view: 'new' as ViewType,
    },
    {
      icon: History,
      label: t.sidebarHistory,
      view: 'history' as ViewType,
    },
    {
      icon: CreditCard,
      label: t.sidebarSubscription,
      view: 'subscription' as ViewType,
    },
    {
      icon: Settings,
      label: t.sidebarSettings,
      view: 'settings' as ViewType,
    },
  ];

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
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
        className={`fixed top-0 left-0 h-screen bg-scene-fill border-r border-keyLight/20 z-modal transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky w-64 flex flex-col`}
      >
        <SidebarHeader />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={currentView === item.view}
              onClick={() => handleNavClick(item.view)}
            />
          ))}
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
