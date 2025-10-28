import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/Button';
import { useState } from 'react';

export default function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
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

  return (
    <div className="p-4 border-b border-keyLight/20">
      <div className="flex items-center gap-3 mb-3">
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
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {profile?.full_name || user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-text-secondary truncate">{user.email}</p>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        variant="scene"
        size="md"
        icon={LogOut}
        fullWidth
      >
        {signingOut ? t.signingOut : t.signOut}
      </Button>
    </div>
  );
}
