import { Cloud, HardDrive, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import type { UserSettings } from '../lib/settingsSync';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  cloudSettings: Omit<UserSettings, 'user_id'>;
  localSettings: Omit<UserSettings, 'user_id'>;
  onResolve: (useCloud: boolean) => void;
  onCancel: () => void;
}

export function ConflictResolutionModal({
  isOpen,
  cloudSettings,
  localSettings,
  onResolve,
  onCancel,
}: ConflictResolutionModalProps) {
  const { t } = useLanguage();

  const getLanguageDisplay = (lang: string) => {
    const map: Record<string, string> = {
      'zh': t['lang.chinese'] || 'Chinese',
      'en': t['lang.english'] || 'English',
      'ja': t['lang.japanese'] || 'Japanese',
      'es': t['lang.spanish'] || 'Spanish',
      'fr': t['lang.french'] || 'French',
      'de': t['lang.german'] || 'German',
      'ko': t['lang.korean'] || 'Korean',
      'auto': t['lang.autoDetect'] || 'Auto Detect',
    };
    return map[lang] || lang;
  };

  const getThemeDisplay = (theme: string) => {
    return theme === 'light'
      ? (t['theme.light'] || 'Light')
      : (t['theme.dark'] || 'Dark');
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="bg-scene-fill rounded-2xl shadow-key max-w-2xl w-full p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-state-warning" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {t['conflict.title'] || 'Settings Conflict'}
            </h2>
            <p className="text-text-secondary">
              {t['conflict.description'] || 'Your local settings differ from cloud settings. Please choose which version to use.'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-state-info/30 rounded-xl p-4 bg-state-info/10">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5 text-state-info" />
              <h3 className="font-semibold text-state-info">
                {t['conflict.cloudSettings'] || 'Cloud Settings'}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-secondary mb-1">
                  {t['conflict.interfaceLanguage'] || 'Interface Language'}
                </p>
                <p className="font-medium text-text-primary">
                  {getLanguageDisplay(cloudSettings.interface_language)}
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">
                  {t['conflict.outputLanguage'] || 'Output Language'}
                </p>
                <p className="font-medium text-text-primary">
                  {getLanguageDisplay(cloudSettings.output_language)}
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">
                  {t['conflict.theme'] || 'Theme'}
                </p>
                <p className="font-medium text-text-primary">
                  {getThemeDisplay(cloudSettings.theme)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-keyLight/20 rounded-xl p-4 bg-scene-fillLight">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-text-secondary" />
              <h3 className="font-semibold text-text-primary">
                {t['conflict.localSettings'] || 'Local Settings'}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-secondary mb-1">
                  {t['conflict.interfaceLanguage'] || 'Interface Language'}
                </p>
                <p className="font-medium text-text-primary">
                  {getLanguageDisplay(localSettings.interface_language)}
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">
                  {t['conflict.outputLanguage'] || 'Output Language'}
                </p>
                <p className="font-medium text-text-primary">
                  {getLanguageDisplay(localSettings.output_language)}
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">
                  {t['conflict.theme'] || 'Theme'}
                </p>
                <p className="font-medium text-text-primary">
                  {getThemeDisplay(localSettings.theme)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => onResolve(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Cloud className="w-5 h-5 mr-2" />
            {t['conflict.useCloud'] || 'Use Cloud Settings'}
          </Button>
          <Button
            onClick={() => onResolve(false)}
            variant="outline"
            className="flex-1"
          >
            <HardDrive className="w-5 h-5 mr-2" />
            {t['conflict.useLocal'] || 'Use Local Settings'}
          </Button>
        </div>

        <button
          onClick={onCancel}
          className="mt-3 w-full text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          {language === 'zh' ? '稍后决定' : 'Decide Later'}
        </button>
      </div>
    </Modal>
  );
}
