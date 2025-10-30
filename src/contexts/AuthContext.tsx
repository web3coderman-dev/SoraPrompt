import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { PromptStorage } from '../lib/promptStorage';
import { SettingsSync } from '../lib/settingsSync';
import { clearGuestUsage } from '../lib/guestUsage';
import { getOAuthRedirectUrl } from '../lib/domainRedirect';
import { useLanguage } from './LanguageContext';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  google_id: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading user profile:', error);
      } else {
        setProfile(data);
      }

      const localCount = PromptStorage.getLocalPromptCount();
      if (localCount > 0) {
        console.log(`Found ${localCount} local prompts, migrating to cloud...`);
        const migratedCount = await PromptStorage.migrateLocalPromptsToCloud(userId);
        console.log(`Successfully migrated ${migratedCount} prompts to cloud`);

        if (migratedCount > 0) {
          window.dispatchEvent(new CustomEvent('prompts-migrated', { detail: { count: migratedCount } }));

          // Use i18n translation with count interpolation
          const message = migratedCount === 1
            ? t['toast.promptSynced']
            : t['toast.promptsSynced'].replace('{count}', migratedCount.toString());

          setTimeout(() => {
            const event = new CustomEvent('show-toast', {
              detail: {
                message,
                type: 'success'
              }
            });
            window.dispatchEvent(event);
          }, 500);
        }
      }

      const syncResult = await SettingsSync.syncOnLogin(userId, true);

      if (syncResult.hasConflict && syncResult.cloudSettings && syncResult.localSettings) {
        window.dispatchEvent(new CustomEvent('settings-conflict', {
          detail: {
            cloudSettings: syncResult.cloudSettings,
            localSettings: syncResult.localSettings,
            userId
          }
        }));
      } else if (syncResult.synced) {
        // Check if we've already shown the sync toast in this session
        const sessionKey = `settings-sync-shown-${userId}`;
        const alreadyShown = sessionStorage.getItem(sessionKey);

        if (!alreadyShown) {
          // Use i18n translations
          const syncMessage = syncResult.usedCloud
            ? t['toast.settingsRestoredFromCloud']
            : t['toast.settingsUploadedToCloud'];

          setTimeout(() => {
            const event = new CustomEvent('show-toast', {
              detail: {
                message: syncMessage,
                type: syncResult.usedCloud ? 'info' : 'success'
              }
            });
            window.dispatchEvent(event);

            window.dispatchEvent(new CustomEvent('settings-synced', {
              detail: syncResult.settings
            }));
          }, 1000);

          // Mark as shown in this session
          sessionStorage.setItem(sessionKey, 'true');
        } else {
          // Still dispatch settings-synced event without toast
          window.dispatchEvent(new CustomEvent('settings-synced', {
            detail: syncResult.settings
          }));
        }
      } else if (syncResult.error) {
        // Use i18n translation for error
        const errorMessage = t['toast.settingsSyncFailed'];

        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
              message: errorMessage,
              type: 'error'
            }
          }));
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use current origin for OAuth callback since Bolt manages Supabase
      // Our code will handle domain redirect after callback
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('OAuth redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in with email:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error signing up with email:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }

      // Clear guest usage data to prevent data leakage
      clearGuestUsage();

      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
