import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PromptInput from '../components/PromptInput';
import PromptResult from '../components/PromptResult';
import History from '../components/History';
import Settings from '../components/Settings';
import { useLanguage } from '../contexts/LanguageContext';
import type { PromptResult as PromptResultType } from '../lib/openai';

type View = 'new' | 'history' | 'settings';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('new');
  const [result, setResult] = useState<PromptResultType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const handleResultGenerated = (newResult: PromptResultType) => {
    setResult(newResult);
  };

  const handleResultUpdated = (updatedResult: PromptResultType) => {
    setResult(updatedResult);
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

            <PromptInput onResult={handleResultGenerated} />

            {result && (
              <div className="mt-8">
                <PromptResult result={result} onResultUpdated={handleResultUpdated} />
              </div>
            )}
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
      <main className="flex-1 p-6 md:p-8 lg:p-12 ml-0 lg:ml-64">
        {renderContent()}
      </main>
    </div>
  );
}
