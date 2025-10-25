import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Info, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Prompt } from '../lib/supabase';
import LanguageSelector from './LanguageSelector';
import type { SupportedLanguage } from '../lib/openai';

type PromptResultProps = {
  prompt: Prompt;
  onImprove: (feedback: string) => void;
  onExplain: () => void;
  onLanguageChange: (language: SupportedLanguage) => void;
  isImproving: boolean;
  isChangingLanguage: boolean;
  explanation?: string;
};

export default function PromptResult({
  prompt,
  onImprove,
  onExplain,
  onLanguageChange,
  isImproving,
  isChangingLanguage,
  explanation
}: PromptResultProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [improvementFeedback, setImprovementFeedback] = useState('');
  const [showImprovementInput, setShowImprovementInput] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    (prompt.output_language as SupportedLanguage) || 'en'
  );

  useEffect(() => {
    setSelectedLanguage((prompt.output_language as SupportedLanguage) || 'en');
  }, [prompt.output_language]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);

    if (lang !== prompt.output_language) {
      onLanguageChange(lang);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.generated_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImprove = () => {
    if (improvementFeedback.trim()) {
      onImprove(improvementFeedback);
      setImprovementFeedback('');
      setShowImprovementInput(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              {t.resultTitle}
            </h3>
            <div className="flex items-center gap-3">
              <LanguageSelector
                value={selectedLanguage}
                onChange={handleLanguageChange}
                detectedLanguage={(prompt as any).detected_input_language as SupportedLanguage || prompt.output_language as SupportedLanguage}
                disabled={isImproving || isChangingLanguage}
              />
              <div className={`px-3 py-1 rounded-full font-semibold text-sm whitespace-nowrap ${getScoreColor(prompt.quality_score)}`}>
                {t.qualityScore}: {prompt.quality_score} / 100
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {isChangingLanguage ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">
                  {t.language === 'zh' ? '正在切换语言...' : 'Changing language...'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {t.soraPrompt}
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 leading-relaxed">
                    {prompt.generated_prompt}
                  </p>
                </div>
              </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {t.styleDirector}
              </label>
              <p className="text-gray-900 font-medium">
                {prompt.style_data.director || 'Cinematic'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {t.technicalParams}
              </label>
              <p className="text-gray-700 text-sm">
                {prompt.style_data.technicalSpecs?.aspect || '16:9'} • {' '}
                {prompt.style_data.technicalSpecs?.fps || '24fps'} • {' '}
                {prompt.style_data.technicalSpecs?.lens || 'cinematic lens'}
              </p>
            </div>
          </div>

          {prompt.intent_data && Object.keys(prompt.intent_data).length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {t.identifiedElements}
              </label>
              <div className="flex flex-wrap gap-2">
                {prompt.intent_data.theme && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {t.theme}: {prompt.intent_data.theme}
                  </span>
                )}
                {prompt.intent_data.tone && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {t.tone}: {prompt.intent_data.tone}
                  </span>
                )}
                {prompt.intent_data.scene && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {t.scene}: {prompt.intent_data.scene}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? t.copiedPrompt : t.copyPrompt}
            </button>

            <button
              onClick={onExplain}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <Info className="w-5 h-5" />
              {t.explain}
            </button>

            <button
              onClick={() => setShowImprovementInput(!showImprovementInput)}
              disabled={isImproving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${isImproving ? 'animate-spin' : ''}`} />
              {t.improve}
            </button>
          </div>

          {showImprovementInput && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.howToImprove}
              </label>
              <input
                type="text"
                value={improvementFeedback}
                onChange={(e) => setImprovementFeedback(e.target.value)}
                placeholder={t.improvePlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
              />
              <button
                onClick={handleImprove}
                disabled={!improvementFeedback.trim() || isImproving}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImproving ? t.improving : t.submitImprovement}
              </button>
            </div>
          )}

          {explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t.explanationTitle}
              </h4>
              <p className="text-blue-800 leading-relaxed text-sm">
                {explanation}
              </p>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
