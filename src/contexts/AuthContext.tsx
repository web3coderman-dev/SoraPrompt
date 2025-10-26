import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { PromptStorage } from '../lib/promptStorage';

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

          const message = `Successfully synced ${migratedCount} ${migratedCount === 1 ? 'record' : 'records'} to cloud!`;
          const messageZh = `已成功同步 ${migratedCount} 条记录到云端！`;

          const userLang = localStorage.getItem('language') || 'en';
          const displayMessage = userLang === 'zh' ? messageZh : message;

          setTimeout(() => {
            const event = new CustomEvent('show-toast', {
              detail: {
                message: displayMessage,
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
        const userLang = localStorage.getItem('language') || 'en';
        const syncMessage = syncResult.usedCloud
          ? (userLang === 'zh' ? '设置已从云端恢复' : 'Settings restored from cloud')
          : (userLang === 'zh' ? '本地设置已上传到云端' : 'Local settings uploaded to cloud');

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
      } else if (syncResult.error) {
        const userLang = localStorage.getItem('language') || 'en';
        const errorMessage = userLang === 'zh'
          ? '设置同步失败'
          : 'Failed to sync settings';

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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
