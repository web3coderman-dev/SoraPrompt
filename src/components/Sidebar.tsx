import { Sparkles, History, Settings, Menu, X, LogOut, User, LogIn, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';
import { Logo } from './ui/Logo';

type ViewType = 'new' | 'history' | 'settings' | 'subscription';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
};

export default function Sidebar({ isOpen, onToggle, currentView, onViewChange }: SidebarProps) {
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setSigningOut(false);
    }
  };

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-scene-fill p-2 rounded-lg shadow-depth-lg border border-keyLight/20"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-text-primary" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-scene-fill border-r border-keyLight/20 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky w-64 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-keyLight/20">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size={32} className="flex-shrink-0" />
            <h2 className="text-xl font-bold font-display text-text-primary whitespace-nowrap">SoraPrompt</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onViewChange(item.view);
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                currentView === item.view
                  ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
                  : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Footer */}
        <div className="border-t border-keyLight/20">
          {user ? (
            <div className="p-4 border-b border-keyLight/20">
              <div className="flex items-center gap-3 mb-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-keyLight/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-keyLight/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-keyLight" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {profile?.full_name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-scene-fillLight hover:bg-scene-fillLight/80 text-text-secondary hover:text-text-primary border border-keyLight/10 hover:border-keyLight/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>{signingOut ? t.signingOut : t.signOut}</span>
              </button>
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-keyLight to-neon hover:shadow-neon text-white rounded-lg transition-all duration-200 shadow-key font-semibold active:scale-[0.98]"
              >
                <LogIn className="w-5 h-5" />
                <span>{t.freeRegister || t.signInSignUp}</span>
              </button>
              <p className="text-xs text-text-tertiary text-center mt-2 leading-relaxed">
                {t.freeRegisterHint || 'Register for 3 free daily generations!'}
              </p>
            </div>
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
