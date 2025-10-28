import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
      backHome: 'Back to Home',
    },
    zh: {
      title: '页面未找到',
      description: '您访问的页面不存在或已被移动。',
      backHome: '返回首页',
    },
  };

  const t = text[language === 'zh' ? 'zh' : 'en'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-keyLight/10 border-2 border-keyLight/20 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-keyLight" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold font-display text-text-primary">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-text-primary">
            {t.title}
          </h2>
          <p className="text-text-secondary">
            {t.description}
          </p>
        </div>

        <Button
          onClick={() => navigate('/')}
          variant="take"
          size="lg"
          icon={Home}
        >
          {t.backHome}
        </Button>
      </div>
    </div>
  );
}
