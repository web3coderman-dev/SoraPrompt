import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { LegalLayout } from '../components/layouts/LegalLayout';
import { useLanguage } from '../contexts/LanguageContext';

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <LegalLayout>
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.notFoundBackHome}
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <Logo size={48} />
          <h1 className="text-3xl md:text-4xl font-bold font-display text-text-primary">{t['privacy.title']}</h1>
        </div>
        <p className="text-sm text-text-secondary">{t['privacy.lastUpdated'] || 'Last updated: January 2025'}</p>
      </div>

      <div className="space-y-8 bg-scene-fill rounded-2xl p-6 md:p-8 border border-border-subtle shadow-depth-sm">
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['privacy.section1.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['privacy.section1.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['privacy.section1.item1']}</li>
                <li>{t['privacy.section1.item2']}</li>
                <li>{t['privacy.section1.item3']}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['privacy.section2.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['privacy.section2.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['privacy.section2.item1']}</li>
                <li>{t['privacy.section2.item2']}</li>
                <li>{t['privacy.section2.item3']}</li>
                <li>{t['privacy.section2.item4']}</li>
                <li>{t['privacy.section2.item5']}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['privacy.section3.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['privacy.section3.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['privacy.section3.item1']}</li>
                <li>{t['privacy.section3.item2']}</li>
                <li>{t['privacy.section3.item3']}</li>
                <li>{t['privacy.section3.item4']}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['privacy.section4.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['privacy.section4.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-text-primary">{t['privacy.section4.google']}</strong>{t['privacy.section4.googleDesc']}
                </li>
                <li>
                  <strong className="text-text-primary">{t['privacy.section4.openai']}</strong>{t['privacy.section4.openaiDesc']}
                </li>
                <li>
                  <strong className="text-text-primary">{t['privacy.section4.supabase']}</strong>{t['privacy.section4.supabaseDesc']}
                </li>
                <li>
                  <strong className="text-text-primary">{t['privacy.section4.stripe']}</strong>{t['privacy.section4.stripeDesc']}
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['privacy.section5.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['privacy.section5.intro']}</p>
            </div>
          </section>
      </div>

      <div className="mt-8 text-center">
        <Button variant="director" size="lg" onClick={() => navigate('/')}>
          {t.notFoundBackHome}
        </Button>
      </div>
    </LegalLayout>
  );
}
