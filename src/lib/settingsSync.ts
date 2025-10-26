import { supabase } from './supabase';
import type { Language } from './i18n';
import type { SupportedLanguage } from './openai';

export interface UserSettings {
  user_id: string;
  interface_language: Language;
  output_language: SupportedLanguage;
  theme: 'light' | 'dark';
  created_at?: string;
  updated_at?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncResult {
  success: boolean;
  synced: boolean;
  usedCloud: boolean;
  hasConflict?: boolean;
  cloudSettings?: Omit<UserSettings, 'user_id'>;
  localSettings?: Omit<UserSettings, 'user_id'>;
  settings: Omit<UserSettings, 'user_id'>;
  error?: string;
}

export class SettingsSync {
  private static readonly LOCAL_KEYS = {
    interfaceLanguage: 'language',
    outputLanguage: 'output-language',
    theme: 'theme',
  };

  private static readonly SYNC_STATUS_KEY = 'settings-sync-status';
  private static readonly LAST_SYNC_KEY = 'settings-last-sync';

  static getLocalSettings(): Omit<UserSettings, 'user_id'> {
    return {
      interface_language: (localStorage.getItem(this.LOCAL_KEYS.interfaceLanguage) as Language) || 'en',
      output_language: (localStorage.getItem(this.LOCAL_KEYS.outputLanguage) as SupportedLanguage) || 'auto',
      theme: (localStorage.getItem(this.LOCAL_KEYS.theme) as 'light' | 'dark') || 'light',
    };
  }

  static setLocalSettings(settings: Partial<Omit<UserSettings, 'user_id'>>): void {
    if (settings.interface_language) {
      localStorage.setItem(this.LOCAL_KEYS.interfaceLanguage, settings.interface_language);
    }
    if (settings.output_language) {
      localStorage.setItem(this.LOCAL_KEYS.outputLanguage, settings.output_language);
    }
    if (settings.theme) {
      localStorage.setItem(this.LOCAL_KEYS.theme, settings.theme);
    }
  }

  static getSyncStatus(): SyncStatus {
    return (localStorage.getItem(this.SYNC_STATUS_KEY) as SyncStatus) || 'idle';
  }

  static setSyncStatus(status: SyncStatus): void {
    localStorage.setItem(this.SYNC_STATUS_KEY, status);
    window.dispatchEvent(new CustomEvent('sync-status-changed', { detail: { status } }));
  }

  static getLastSyncTime(): Date | null {
    const timestamp = localStorage.getItem(this.LAST_SYNC_KEY);
    return timestamp ? new Date(timestamp) : null;
  }

  static setLastSyncTime(date: Date): void {
    localStorage.setItem(this.LAST_SYNC_KEY, date.toISOString());
  }

  static async loadCloudSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading cloud settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading cloud settings:', error);
      return null;
    }
  }

  static async saveCloudSettings(userId: string, settings: Omit<UserSettings, 'user_id'>): Promise<boolean> {
    try {
      this.setSyncStatus('syncing');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          ...settings,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving cloud settings:', error);
        this.setSyncStatus('error');
        return false;
      }

      this.setSyncStatus('success');
      this.setLastSyncTime(new Date());
      return true;
    } catch (error) {
      console.error('Error saving cloud settings:', error);
      this.setSyncStatus('error');
      return false;
    }
  }

  static hasLocalChanges(): boolean {
    return Object.values(this.LOCAL_KEYS).some(key => {
      return localStorage.getItem(key) !== null;
    });
  }

  static detectConflict(
    localSettings: Omit<UserSettings, 'user_id'>,
    cloudSettings: Omit<UserSettings, 'user_id'>
  ): boolean {
    return (
      localSettings.interface_language !== cloudSettings.interface_language ||
      localSettings.output_language !== cloudSettings.output_language ||
      localSettings.theme !== cloudSettings.theme
    );
  }

  static async syncOnLogin(userId: string, preferCloud: boolean = true): Promise<SyncResult> {
    try {
      this.setSyncStatus('syncing');
      const localSettings = this.getLocalSettings();
      const cloudSettings = await this.loadCloudSettings(userId);

      if (!cloudSettings) {
        const success = await this.saveCloudSettings(userId, localSettings);
        return {
          success,
          synced: success,
          usedCloud: false,
          settings: localSettings,
          error: success ? undefined : 'Failed to upload local settings',
        };
      }

      const hasConflict = this.detectConflict(localSettings, {
        interface_language: cloudSettings.interface_language,
        output_language: cloudSettings.output_language,
        theme: cloudSettings.theme,
      });

      if (hasConflict && !preferCloud) {
        return {
          success: false,
          synced: false,
          usedCloud: false,
          hasConflict: true,
          cloudSettings: {
            interface_language: cloudSettings.interface_language,
            output_language: cloudSettings.output_language,
            theme: cloudSettings.theme,
          },
          localSettings,
          settings: localSettings,
        };
      }

      const settingsToUse = preferCloud ? {
        interface_language: cloudSettings.interface_language,
        output_language: cloudSettings.output_language,
        theme: cloudSettings.theme,
      } : localSettings;

      this.setLocalSettings(settingsToUse);

      if (!preferCloud && hasConflict) {
        await this.saveCloudSettings(userId, localSettings);
      }

      this.setSyncStatus('success');
      this.setLastSyncTime(new Date());

      return {
        success: true,
        synced: true,
        usedCloud: preferCloud,
        hasConflict,
        cloudSettings: preferCloud ? undefined : {
          interface_language: cloudSettings.interface_language,
          output_language: cloudSettings.output_language,
          theme: cloudSettings.theme,
        },
        settings: settingsToUse,
      };
    } catch (error) {
      console.error('Error syncing settings on login:', error);
      this.setSyncStatus('error');
      return {
        success: false,
        synced: false,
        usedCloud: false,
        settings: this.getLocalSettings(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async updateSetting<K extends keyof Omit<UserSettings, 'user_id'>>(
    userId: string | null,
    key: K,
    value: Omit<UserSettings, 'user_id'>[K]
  ): Promise<boolean> {
    const localKey = {
      interface_language: this.LOCAL_KEYS.interfaceLanguage,
      output_language: this.LOCAL_KEYS.outputLanguage,
      theme: this.LOCAL_KEYS.theme,
    }[key];

    localStorage.setItem(localKey, value as string);

    if (userId) {
      const currentSettings = await this.loadCloudSettings(userId);
      const updatedSettings = {
        ...this.getLocalSettings(),
        ...currentSettings,
        [key]: value,
      };

      return await this.saveCloudSettings(userId, updatedSettings);
    }

    return true;
  }

  static async manualSync(userId: string): Promise<SyncResult> {
    try {
      this.setSyncStatus('syncing');
      const localSettings = this.getLocalSettings();
      const success = await this.saveCloudSettings(userId, localSettings);

      return {
        success,
        synced: success,
        usedCloud: false,
        settings: localSettings,
        error: success ? undefined : 'Failed to sync settings',
      };
    } catch (error) {
      console.error('Error during manual sync:', error);
      this.setSyncStatus('error');
      return {
        success: false,
        synced: false,
        usedCloud: false,
        settings: this.getLocalSettings(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async resolveConflict(
    userId: string,
    useCloud: boolean,
    cloudSettings?: Omit<UserSettings, 'user_id'>,
    localSettings?: Omit<UserSettings, 'user_id'>
  ): Promise<SyncResult> {
    try {
      this.setSyncStatus('syncing');

      if (useCloud && cloudSettings) {
        this.setLocalSettings(cloudSettings);
        this.setSyncStatus('success');
        this.setLastSyncTime(new Date());

        return {
          success: true,
          synced: true,
          usedCloud: true,
          settings: cloudSettings,
        };
      } else if (!useCloud && localSettings) {
        const success = await this.saveCloudSettings(userId, localSettings);
        return {
          success,
          synced: success,
          usedCloud: false,
          settings: localSettings,
          error: success ? undefined : 'Failed to upload local settings',
        };
      }

      throw new Error('Invalid conflict resolution parameters');
    } catch (error) {
      console.error('Error resolving conflict:', error);
      this.setSyncStatus('error');
      return {
        success: false,
        synced: false,
        usedCloud: false,
        settings: this.getLocalSettings(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
