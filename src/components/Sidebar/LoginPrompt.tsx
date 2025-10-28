import { LogIn } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface LoginPromptProps {
  onLogin: () => void;
}

export default function LoginPrompt({ onLogin }: LoginPromptProps) {
  const { t } = useLanguage();
  const { sidebarCollapsed } = useTheme();

  if (sidebarCollapsed) {
    return (
      <div className="p-4 flex justify-center">
        <Tooltip content={t.freeRegister || t.signInSignUp} position="right">
          <button
            onClick={onLogin}
            className="p-3 rounded-lg text-white bg-gradient-to-br from-[#3961FB] to-[#5A7FFF] hover:from-[#4A72FF] hover:to-[#6B8FFF] border border-transparent transition-all duration-200 shadow-depth-md hover:shadow-key"
          >
            <LogIn className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-hidden">
      <Button
        onClick={onLogin}
        variant="take"
        size="lg"
        icon={LogIn}
        fullWidth
        style={{
          opacity: sidebarCollapsed ? 0 : 1,
          height: sidebarCollapsed ? 0 : 'auto',
          padding: sidebarCollapsed ? 0 : undefined,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {t.freeRegister || t.signInSignUp}
      </Button>
    </div>
  );
}
