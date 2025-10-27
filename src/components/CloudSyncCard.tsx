import { Cloud, CloudOff, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui';
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
  if (!user) {
    return (
      <div className="mb-6 bg-state-warning/10 border-2 border-state-warning/30 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <CloudOff className="w-5 h-5 text-state-warning" />
          <p className="text-sm font-medium text-text-primary">
            {language === 'zh' ? '设置仅保存在本地' : 'Settings saved locally only'}
          </p>
        </div>
        <p className="text-xs text-text-secondary">
          {language === 'zh'
            ? '登录以启用云端同步，跨设备保持设置一致'
            : 'Sign in to enable cloud sync and keep settings consistent across devices'
          }
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
              aria-label={language === 'zh' ? '正在同步' : 'Syncing'}
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
                ? (language === 'zh' ? '正在同步...' : 'Syncing...')
                : syncStatus === 'success'
                ? (language === 'zh' ? '云端同步已启用' : 'Cloud sync enabled')
                : syncStatus === 'error'
                ? (language === 'zh' ? '同步失败' : 'Sync failed')
                : (language === 'zh' ? '云端同步' : 'Cloud sync')
              }
            </p>
            {lastSynced && !syncing && syncStatus !== 'error' && (
              <p className="text-xs text-text-secondary mt-0.5">
                {language === 'zh' ? '上次同步: ' : 'Last synced: '}
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
          aria-label={language === 'zh' ? '立即同步设置到云端' : 'Sync settings to cloud now'}
          aria-busy={syncing}
        >
          {language === 'zh' ? '立即同步' : 'Sync Now'}
        </Button>
      </div>
      <p className="text-xs text-text-secondary mt-2">
        {language === 'zh'
          ? '设置修改后自动同步到云端，可跨设备访问'
          : 'Settings are automatically synced to cloud and accessible across devices'
        }
      </p>
    </div>
  );
}
