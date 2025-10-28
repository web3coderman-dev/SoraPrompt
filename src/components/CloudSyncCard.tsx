import { Cloud, CloudOff, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui';
import { useLanguage } from '../contexts/LanguageContext';
import type { SyncStatus } from '../lib/settingsSync';

interface CloudSyncCardProps {
  user: any;
  syncStatus: SyncStatus;
  syncing: boolean;
  lastSynced: Date | null;
  syncError: string | null;
  language: string;
  onManualSync: () => void;
}

export function CloudSyncCard({
  user,
  syncStatus,
  syncing,
  lastSynced,
  syncError,
  language,
  onManualSync,
}: CloudSyncCardProps) {
  const { t } = useLanguage();
  if (!user) {
    return (
      <div className="mb-6 bg-state-warning/10 border-2 border-state-warning/30 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <CloudOff className="w-5 h-5 text-state-warning" />
          <p className="text-sm font-medium text-text-primary">
            {t['settings.localOnlyTitle']}
          </p>
        </div>
        <p className="text-xs text-text-secondary">
          {t['settings.localOnlyDesc']}
        </p>
      </div>
    );
  }

  return (
    <div className={`mb-6 rounded-lg p-4 border-2 transition-all duration-300 ${
      syncStatus === 'success' ? 'bg-state-ok/10 border-state-ok/30' :
      syncStatus === 'error' ? 'bg-state-error/10 border-state-error/30' :
      syncStatus === 'syncing' ? 'bg-state-warning/10 border-state-warning/30' :
      'bg-scene-fillLight border-keyLight/20'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {syncStatus === 'syncing' || syncing ? (
            <div
              className="animate-spin rounded-full h-5 w-5 border-2 border-neon border-t-transparent"
              role="status"
              aria-label={t['settings.syncing']}
            />
          ) : syncStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 text-state-ok" />
          ) : syncStatus === 'error' ? (
            <XCircle className="w-5 h-5 text-state-error" />
          ) : (
            <Cloud className="w-5 h-5 text-keyLight" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">
              {syncStatus === 'syncing' || syncing
                ? t['settings.syncing']
                : syncStatus === 'success'
                ? t['settings.cloudSyncEnabled']
                : syncStatus === 'error'
                ? t['settings.syncFailed']
                : t['settings.cloudSync']
              }
            </p>
            {lastSynced && !syncing && syncStatus !== 'error' && (
              <p className="text-xs text-text-secondary mt-0.5">
                {t['settings.lastSynced']}
                {lastSynced.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US')}
              </p>
            )}
            {syncError && (
              <p className="text-xs text-state-error mt-0.5">{syncError}</p>
            )}
          </div>
        </div>
        <Button
          onClick={onManualSync}
          disabled={syncing || syncStatus === 'syncing'}
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          aria-label={t['settings.syncNowAria']}
          aria-busy={syncing}
        >
          {t['settings.syncNow']}
        </Button>
      </div>
      <p className="text-xs text-text-secondary mt-2">
        {t['settings.autoSyncDesc']}
      </p>
    </div>
  );
}
