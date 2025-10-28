import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { useState } from 'react';

export default function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { sidebarCollapsed } = useTheme();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setSigningOut(false);
    }
  };

  if (sidebarCollapsed) {
    return (
      <div className="p-4 flex flex-col items-center gap-2">
        <Tooltip content={profile?.full_name || user.email?.split('@')[0] || 'User'} position="right">
          <div>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                className="w-10 h-10 rounded-full border-2 border-keyLight/20 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-keyLight/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-keyLight" />
              </div>
            )}
          </div>
        </Tooltip>
        <Tooltip content={signingOut ? t.signingOut : t.signOut} position="right">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-scene-fillLight border border-keyLight/5 hover:border-keyLight/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-keyLight/20">
      <div className="flex items-center gap-3 mb-3 overflow-hidden">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="w-10 h-10 rounded-full border-2 border-keyLight/20 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-keyLight/20 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-keyLight" />
          </div>
        )}
        <div className="flex-1 min-w-0" style={{
          opacity: sidebarCollapsed ? 0 : 1,
          width: sidebarCollapsed ? 0 : 'auto',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <p className="text-sm font-medium text-text-primary truncate whitespace-nowrap">
            {profile?.full_name || user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-text-secondary truncate whitespace-nowrap">{user.email}</p>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        variant="scene"
        size="md"
        icon={LogOut}
        fullWidth
        style={{
          opacity: sidebarCollapsed ? 0 : 1,
          height: sidebarCollapsed ? 0 : 'auto',
          marginTop: sidebarCollapsed ? 0 : undefined,
          padding: sidebarCollapsed ? 0 : undefined,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {signingOut ? t.signingOut : t.signOut}
      </Button>
    </div>
  );
}
