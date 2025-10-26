import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Info, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Prompt } from '../lib/supabase';
import LanguageSelector from './LanguageSelector';
import type { SupportedLanguage } from '../lib/openai';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge, QualityBadge } from './ui/Badge';

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
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('output-language') as SupportedLanguage) || 'en';
  });

  useEffect(() => {
    const lang = (localStorage.getItem('output-language') as SupportedLanguage) || 'en';
    setSelectedLanguage(lang);
  }, [prompt]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    localStorage.setItem('output-language', lang);
    onLanguageChange(lang);
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

  return (
    <Card className="animate-fade-in">
      <CardHeader gradient>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            {t.resultTitle}
          </h3>
          <div className="flex items-center gap-3">
            <LanguageSelector
              value={selectedLanguage}
              onChange={handleLanguageChange}
              detectedLanguage={selectedLanguage}
              disabled={isImproving || isChangingLanguage}
            />
            <QualityBadge score={prompt.quality_score} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {isChangingLanguage ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-gray-600">
                {t.changingLanguage}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t.soraPrompt}
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-colors hover:border-gray-300">
                <p className="text-gray-900 leading-relaxed">
                  {prompt.generated_prompt}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t.styleDirector}
                </label>
                <p className="text-gray-900 font-medium">
                  {prompt.style_data.director || 'Cinematic'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t.identifiedElements}
                </label>
                <div className="flex flex-wrap gap-2">
                  {prompt.intent_data.theme && (
                    <Badge variant="info">
                      {t.theme}: {prompt.intent_data.theme}
                    </Badge>
                  )}
                  {prompt.intent_data.tone && (
                    <Badge variant="secondary">
                      {t.tone}: {prompt.intent_data.tone}
                    </Badge>
                  )}
                  {prompt.intent_data.scene && (
                    <Badge variant="success">
                      {t.scene}: {prompt.intent_data.scene}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Button
                variant="secondary"
                icon={copied ? Check : Copy}
                onClick={handleCopy}
                fullWidth
              >
                {copied ? t.copiedPrompt : t.copyPrompt}
              </Button>

              <Button
                variant="primary"
                icon={Info}
                onClick={onExplain}
                fullWidth
              >
                {t.explain}
              </Button>

              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={() => setShowImprovementInput(!showImprovementInput)}
                disabled={isImproving}
                loading={isImproving}
                fullWidth
              >
                {t.improve}
              </Button>
            </div>

            {showImprovementInput && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-slide-down">
                <Input
                  label={t.howToImprove}
                  value={improvementFeedback}
                  onChange={(e) => setImprovementFeedback(e.target.value)}
                  placeholder={t.improvePlaceholder}
                  onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
                />
                <Button
                  variant="primary"
                  onClick={handleImprove}
                  disabled={!improvementFeedback.trim() || isImproving}
                  loading={isImproving}
                  fullWidth
                >
                  {isImproving ? t.improving : t.submitImprovement}
                </Button>
              </div>
            )}

            {explanation && (
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200 animate-slide-down">
                <h4 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {t.explanationTitle}
                </h4>
                <p className="text-primary-800 leading-relaxed text-sm">
                  {explanation}
                </p>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
