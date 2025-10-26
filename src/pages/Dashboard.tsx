import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PromptInput from '../components/PromptInput';
import PromptResult from '../components/PromptResult';
import History from '../components/History';
import Settings from '../components/Settings';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import type { Prompt } from '../lib/supabase';
import type { SupportedLanguage } from '../lib/openai';
import { generateSoraPrompt } from '../lib/promptGenerator';
import { improvePrompt, explainPrompt, generatePrompt } from '../lib/openai';
import { PromptStorage } from '../lib/promptStorage';

type View = 'new' | 'history' | 'settings';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('new');
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [explanation, setExplanation] = useState<string | undefined>();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleGenerate = async (
    input: string,
    mode: 'quick' | 'director',
    language: SupportedLanguage,
    detectedInputLanguage: SupportedLanguage
  ) => {
    try {
      setIsGenerating(true);
      setExplanation(undefined);

      const prompt = await generateSoraPrompt(
        input,
        mode,
        language,
        detectedInputLanguage,
        user?.id
      );

      setCurrentPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert(t.language === 'zh' ? '生成失败，请重试' : 'Generation failed, please retry');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (feedback: string) => {
    if (!currentPrompt) return;

    try {
      setIsImproving(true);

      const outputLang = localStorage.getItem('output-language') as SupportedLanguage || 'en';
      const result = await improvePrompt(
        currentPrompt.generated_prompt,
        feedback,
        outputLang
      );

      const updatedPrompt: Prompt = {
        ...currentPrompt,
        generated_prompt: result.prompt,
        quality_score: result.qualityScore,
        updated_at: new Date().toISOString(),
      };

      if (user?.id && currentPrompt.user_id) {
        await PromptStorage.saveToCloud(updatedPrompt, user.id);
      } else {
        PromptStorage.saveLocalPrompt(updatedPrompt);
      }

      setCurrentPrompt(updatedPrompt);
    } catch (error) {
      console.error('Error improving prompt:', error);
      alert(t.language === 'zh' ? '改进失败，请重试' : 'Improvement failed, please retry');
    } finally {
      setIsImproving(false);
    }
  };

  const handleExplain = async () => {
    if (!currentPrompt) return;

    try {
      const outputLang = localStorage.getItem('output-language') as SupportedLanguage || 'en';
      const explanation = await explainPrompt(
        currentPrompt.generated_prompt,
        currentPrompt.intent_data,
        outputLang
      );
      setExplanation(explanation);
    } catch (error) {
      console.error('Error explaining prompt:', error);
      alert(t.language === 'zh' ? '解释失败，请重试' : 'Explanation failed, please retry');
    }
  };

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (!currentPrompt) return;

    try {
      setIsChangingLanguage(true);

      const { prompt, qualityScore } = await generatePrompt(
        currentPrompt.intent_data,
        currentPrompt.style_data,
        currentPrompt.mode,
        language
      );

      const updatedPrompt: Prompt = {
        ...currentPrompt,
        generated_prompt: prompt,
        quality_score: qualityScore,
        updated_at: new Date().toISOString(),
      };

      if (user?.id && currentPrompt.user_id) {
        await PromptStorage.saveToCloud(updatedPrompt, user.id);
      } else {
        PromptStorage.saveLocalPrompt(updatedPrompt);
      }

      setCurrentPrompt(updatedPrompt);
    } catch (error) {
      console.error('Error changing language:', error);
      alert(t.language === 'zh' ? '语言切换失败，请重试' : 'Language change failed, please retry');
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const handlePromptSelected = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
    setCurrentView('new');
    setExplanation(undefined);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return <History onSelectPrompt={handlePromptSelected} />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="max-w-7xl mx-auto">
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

            <PromptInput
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              initialValue={currentPrompt?.user_input}
            />

            {currentPrompt && (
              <div className="mt-8">
                <PromptResult
                  prompt={currentPrompt}
                  onImprove={handleImprove}
                  onExplain={handleExplain}
                  onLanguageChange={handleLanguageChange}
                  isImproving={isImproving}
                  isChangingLanguage={isChangingLanguage}
                  explanation={explanation}
                />
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
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        {renderContent()}
      </main>
    </div>
  );
}
