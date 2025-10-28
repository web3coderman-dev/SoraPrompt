import { LogIn } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/Button';

interface LoginPromptProps {
  onLogin: () => void;
}

export default function LoginPrompt({ onLogin }: LoginPromptProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4">
      <Button
        onClick={onLogin}
        variant="take"
        size="lg"
        icon={LogIn}
        fullWidth
      >
        {t.freeRegister || t.signInSignUp}
      </Button>
      <p className="text-xs text-text-tertiary text-center mt-2 leading-relaxed">
        {t.freeRegisterHint || 'Register for 3 free daily generations!'}
      </p>
    </div>
  );
}
