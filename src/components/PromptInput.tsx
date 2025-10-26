import { useState, useEffect } from 'react';
import { Sparkles, Film } from 'lucide-react';
import { type SupportedLanguage, detectLanguageClient } from '../lib/openai';
import { useLanguage } from '../contexts/LanguageContext';

type PromptInputProps = {
  onGenerate: (input: string, mode: 'quick' | 'director', language: SupportedLanguage, detectedInputLanguage: SupportedLanguage) => void;
  isLoading: boolean;
  initialValue?: string;
};

export default function PromptInput({ onGenerate, isLoading, initialValue }: PromptInputProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      if (initialValue.trim()) {
        detectLanguageClient(initialValue).then(detected => {
          setDetectedLanguage(detected);
        });
      }
    }
  }, [initialValue]);

  const handleInputChange = async (value: string) => {
    setInput(value);
    if (value.trim()) {
      const detected = await detectLanguageClient(value);
      setDetectedLanguage(detected);
    }
  };

  const handleSubmit = async (mode: 'quick' | 'director') => {
    if (input.trim() && !isLoading) {
      const outputLanguage = localStorage.getItem('output-language') as SupportedLanguage || 'auto';

      const detected = await detectLanguageClient(input);
      setDetectedLanguage(detected);

      let language: SupportedLanguage;
      if (outputLanguage === 'auto') {
        language = detected;
      } else {
        language = outputLanguage;
      }

      onGenerate(input, mode, language, detected);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit('quick');
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t.inputLabel}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.inputPlaceholder}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 text-sm md:text-base"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col sm:flex-row gap-2 md:gap-3">
          <button
            onClick={() => handleSubmit('quick')}
            disabled={!input.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 text-sm md:text-base"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            {t.quickGenerate}
          </button>

          <button
            onClick={() => handleSubmit('director')}
            disabled={!input.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 text-sm md:text-base"
          >
            <Film className="w-4 h-4 md:w-5 md:h-5" />
            {t.directorMode}
          </button>
        </div>

        {isLoading && (
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              <span>{t.generating}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
