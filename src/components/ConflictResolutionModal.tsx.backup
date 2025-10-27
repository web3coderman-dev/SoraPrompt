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
  const { language } = useLanguage();

  const getLanguageDisplay = (lang: string) => {
    const map: Record<string, string> = {
      'zh': language === 'zh' ? '中文' : 'Chinese',
      'en': language === 'zh' ? '英文' : 'English',
      'ja': language === 'zh' ? '日文' : 'Japanese',
      'es': language === 'zh' ? '西班牙文' : 'Spanish',
      'fr': language === 'zh' ? '法文' : 'French',
      'de': language === 'zh' ? '德文' : 'German',
      'ko': language === 'zh' ? '韩文' : 'Korean',
      'auto': language === 'zh' ? '自动检测' : 'Auto Detect',
    };
    return map[lang] || lang;
  };

  const getThemeDisplay = (theme: string) => {
    return theme === 'light'
      ? (language === 'zh' ? '浅色' : 'Light')
      : (language === 'zh' ? '深色' : 'Dark');
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'zh' ? '设置冲突' : 'Settings Conflict'}
            </h2>
            <p className="text-gray-600">
              {language === 'zh'
                ? '检测到本地设置与云端设置不同，请选择要使用的版本。'
                : 'Your local settings differ from cloud settings. Please choose which version to use.'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                {language === 'zh' ? '云端设置' : 'Cloud Settings'}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">
                  {language === 'zh' ? '界面语言' : 'Interface Language'}
                </p>
                <p className="font-medium text-gray-900">
                  {getLanguageDisplay(cloudSettings.interface_language)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  {language === 'zh' ? '输出语言' : 'Output Language'}
                </p>
                <p className="font-medium text-gray-900">
                  {getLanguageDisplay(cloudSettings.output_language)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  {language === 'zh' ? '主题' : 'Theme'}
                </p>
                <p className="font-medium text-gray-900">
                  {getThemeDisplay(cloudSettings.theme)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                {language === 'zh' ? '本地设置' : 'Local Settings'}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">
                  {language === 'zh' ? '界面语言' : 'Interface Language'}
                </p>
                <p className="font-medium text-gray-900">
                  {getLanguageDisplay(localSettings.interface_language)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  {language === 'zh' ? '输出语言' : 'Output Language'}
                </p>
                <p className="font-medium text-gray-900">
                  {getLanguageDisplay(localSettings.output_language)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  {language === 'zh' ? '主题' : 'Theme'}
                </p>
                <p className="font-medium text-gray-900">
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
            {language === 'zh' ? '使用云端设置' : 'Use Cloud Settings'}
          </Button>
          <Button
            onClick={() => onResolve(false)}
            variant="outline"
            className="flex-1"
          >
            <HardDrive className="w-5 h-5 mr-2" />
            {language === 'zh' ? '使用本地设置' : 'Use Local Settings'}
          </Button>
        </div>

        <button
          onClick={onCancel}
          className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {language === 'zh' ? '稍后决定' : 'Decide Later'}
        </button>
      </div>
    </Modal>
  );
}
