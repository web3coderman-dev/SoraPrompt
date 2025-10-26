import { useState } from 'react';
import { AlertCircle, UserCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PromptContainer from '../components/PromptContainer';
import History from '../components/History';
import Settings from '../components/Settings';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import type { Prompt } from '../lib/supabase';

type View = 'home' | 'history' | 'settings';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [result, setResult] = useState<Prompt | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const { isGuest } = useAuth();

  const handleResultGenerated = (newResult: Prompt) => {
    setResult(newResult);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return <History onViewPrompt={setResult} />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="max-w-4xl mx-auto">
            {isGuest && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <UserCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-medium">
                    {t.language === 'zh' ? '游客模式' : 'Guest Mode'}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {t.language === 'zh'
                      ? '您正在以游客身份使用。历史记录不会被保存。'
                      : 'You are using as a guest. History will not be saved.'}
                    <button
                      onClick={() => {
                        localStorage.removeItem('guestMode');
                        window.location.reload();
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      {t.language === 'zh' ? '注册保存历史' : 'Sign up to save history'}
                    </button>
                  </p>
                </div>
              </div>
            )}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {t.tagMVP}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                {t.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {t.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg text-sm font-medium">
                  {t.tagGeneration}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-lg text-sm font-medium">
                  {t.tagAssistant}
                </span>
              </div>
            </div>

            <PromptContainer onResult={handleResultGenerated} />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="flex-1 p-6 md:p-8 lg:p-12 ml-0 md:ml-64">
        {renderContent()}
      </main>
    </div>
  );
}
