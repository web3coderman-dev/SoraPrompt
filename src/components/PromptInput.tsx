import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Film } from 'lucide-react';
import { type SupportedLanguage, detectLanguageClient } from '../lib/openai';
import { useLanguage } from '../contexts/LanguageContext';
import { Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardBody, CardFooter } from './ui/Card';

type PromptInputProps = {
  onGenerate: (input: string, mode: 'quick' | 'director', language: SupportedLanguage, detectedInputLanguage: SupportedLanguage) => void;
  isLoading: boolean;
  initialValue?: string;
};

export default function PromptInput({ onGenerate, isLoading, initialValue }: PromptInputProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>('en');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const detectLanguageDebounced = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (value.trim()) {
        const detected = await detectLanguageClient(value);
        setDetectedLanguage(detected);
      }
    }, 1000);
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);

    const outputLanguage = localStorage.getItem('output-language') as SupportedLanguage || 'auto';
    if (outputLanguage === 'auto' && value.trim()) {
      detectLanguageDebounced(value);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
    <Card className="animate-fade-in">
      <CardBody>
        <Textarea
          label={t.inputLabel}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.inputPlaceholder}
          rows={3}
          disabled={isLoading}
        />
      </CardBody>

      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          icon={Sparkles}
          onClick={() => handleSubmit('quick')}
          disabled={!input.trim() || isLoading}
          loading={isLoading && !isLoading}
          fullWidth
        >
          {t.quickGenerate}
        </Button>

        <Button
          variant="gradient"
          icon={Film}
          onClick={() => handleSubmit('director')}
          disabled={!input.trim() || isLoading}
          fullWidth
        >
          {t.directorMode}
        </Button>
      </CardFooter>

      {isLoading && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600 animate-fade-in">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent" />
            <span>{t.generating}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
