import { useState, useEffect } from 'react';
import { Sparkles, Clapperboard, Lock } from 'lucide-react';
import { type SupportedLanguage, detectLanguageClient } from '../lib/openai';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardBody, CardFooter } from './ui/Card';
import { Modal } from './ui/Modal';
import { LoginPrompt } from './LoginPrompt';

type PromptInputProps = {
  onGenerate: (input: string, mode: 'quick' | 'director', language: SupportedLanguage, detectedInputLanguage: SupportedLanguage) => void;
  isLoading: boolean;
  initialValue?: string;
};

export default function PromptInput({ onGenerate, isLoading, initialValue }: PromptInputProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (mode: 'quick' | 'director') => {
    if (!user && mode === 'director') {
      setShowLoginPrompt(true);
      return;
    }

    if (input.trim() && !isLoading) {
      const outputLanguage = localStorage.getItem('output-language') as SupportedLanguage || 'auto';

      const detected = await detectLanguageClient(input);

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
    <Card variant="script" className="animate-fade-in">
      <CardBody>
        <Textarea
          label={t.inputLabel}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.inputPlaceholder}
          rows={3}
          disabled={isLoading}
        />
      </CardBody>

      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-1/2">
          <Button
            variant="take"
            icon={Sparkles}
            onClick={() => handleSubmit('quick')}
            disabled={!input.trim() || isLoading}
            loading={isLoading && !isLoading}
            fullWidth
          >
            {t.quickGenerate}
          </Button>
        </div>

        <div className="relative w-full sm:w-1/2">
          <Button
            variant="director"
            icon={user ? Clapperboard : Lock}
            onClick={() => handleSubmit('director')}
            disabled={!input.trim() || isLoading}
            fullWidth
          >
            {t.directorMode}
          </Button>
        </div>
      </CardFooter>

      {isLoading && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 text-sm text-text-secondary animate-fade-in">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-neon border-t-transparent" />
            <span className="font-code">{t.generating}</span>
          </div>
        </div>
      )}

      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        maxWidth="md"
        showCloseButton={true}
        variant="default"
      >
        <LoginPrompt
          title={language === 'zh' ? '登录以使用 Director 模式' : 'Sign in to use Director Mode'}
          message={language === 'zh'
            ? 'Director 模式提供更详细的描述和分镜头脚本，帮助您创作更专业的视频内容'
            : 'Director Mode provides detailed descriptions and storyboard scripts to help you create more professional video content'
          }
          benefits={[
            language === 'zh' ? '完整版 Prompt + 分镜头脚本' : 'Full Prompt + Storyboard Script',
            language === 'zh' ? '更专业的视频描述' : 'More professional video descriptions',
            language === 'zh' ? '高质量输出结果' : 'Higher quality output',
            language === 'zh' ? '解锁更多高级功能' : 'Unlock more premium features',
          ]}
          onLoginSuccess={() => setShowLoginPrompt(false)}
        />
      </Modal>
    </Card>
  );
}
