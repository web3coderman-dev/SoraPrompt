import { useNavigate } from 'react-router-dom';
import { Home, Film } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-scene-background">
      <div className="text-center px-4 max-w-2xl">
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto rounded-full bg-keyLight/10 flex items-center justify-center border-2 border-keyLight/20 relative overflow-hidden">
            <Film className="w-16 h-16 text-keyLight animate-render-pulse" />
            <div className="absolute inset-0 bg-keyLight/5 animate-light-blink" />
          </div>
        </div>

        <h1 className="text-6xl font-display font-bold text-text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl font-display font-bold text-keyLight mb-4">
          {t.notFoundTitle}
        </h2>
        <p className="text-text-secondary mb-2 text-lg">
          {t.notFoundDescription}
        </p>

        <div className="mt-8">
          <Button
            variant="take"
            size="lg"
            icon={Home}
            onClick={() => navigate('/')}
          >
            {t.notFoundBackHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
