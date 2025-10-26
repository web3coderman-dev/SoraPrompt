import { Film, Sparkles, History, Settings, Menu, X, LogOut, User, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

type ViewType = 'new' | 'history' | 'settings';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
};

export default function Sidebar({ isOpen, onToggle, currentView, onViewChange }: SidebarProps) {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setSigningOut(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Error signing in:', error);
      setSigningIn(false);
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
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky w-64 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">Sora Studio</h2>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.view
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Footer */}
        <div className="border-t border-gray-200">
          {user ? (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>{signingOut ? (t.language === 'zh' ? '退出中...' : 'Signing out...') : (t.language === 'zh' ? '退出登录' : 'Sign Out')}</span>
              </button>
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <LogIn className="w-5 h-5" />
                <span>{signingIn ? (t.language === 'zh' ? '登录中...' : 'Signing in...') : (t.language === 'zh' ? '使用 Google 登录' : 'Sign in with Google')}</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                {t.language === 'zh' ? '登录以保存和查看历史记录' : 'Sign in to save and view history'}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
