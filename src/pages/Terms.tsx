import { Logo } from '../components/ui/Logo';
import { LegalLayout } from '../components/layouts/LegalLayout';
import { useLanguage } from '../contexts/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <LegalLayout>
      <div className="mt-10 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Logo size={48} />
          <h1 className="text-3xl md:text-4xl font-bold font-display text-text-primary">{t['terms.title']}</h1>
        </div>
        <p className="text-sm text-text-secondary">{t['terms.lastUpdated'] || 'Last updated: January 2025'}</p>
      </div>

      <div className="space-y-8 bg-scene-fill rounded-2xl p-6 md:p-8 border border-border-subtle shadow-depth-sm">
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['terms.section1.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['terms.section1.content']}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['terms.section2.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['terms.section2.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['terms.section2.item1']}</li>
                <li>{t['terms.section2.item2']}</li>
                <li>{t['terms.section2.item3']}</li>
                <li>{t['terms.section2.item4']}</li>
                <li>{t['terms.section2.item5']}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['terms.section3.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['terms.section3.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['terms.section3.item1']}</li>
                <li>{t['terms.section3.item2']}</li>
                <li>{t['terms.section3.item3']}</li>
                <li>{t['terms.section3.item4']}</li>
                <li>{t['terms.section3.item5']}</li>
                <li>{t['terms.section3.item6']}</li>
                <li>{t['terms.section3.item7']}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['terms.section4.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>
                <strong className="text-text-primary">{t['terms.section4.userContent']}</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['terms.section4.item1']}</li>
                <li>{t['terms.section4.item2']}</li>
                <li>{t['terms.section4.item3']}</li>
              </ul>
              <p className="mt-3">
                <strong className="text-text-primary">{t['terms.section4.generatedContent']}</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['terms.section4.item4']}</li>
                <li>{t['terms.section4.item5']}</li>
                <li>{t['terms.section4.item6']}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-text-primary">{t['terms.section5.title']}</h2>
            <div className="text-sm md:text-base text-text-secondary space-y-3 leading-relaxed">
              <p>{t['terms.section5.intro']}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t['terms.section5.item1']}</li>
                <li>{t['terms.section5.item2']}</li>
                <li>{t['terms.section5.item3']}</li>
                <li>{t['terms.section5.item4']}</li>
              </ul>
            </div>
          </section>
      </div>
    </LegalLayout>
  );
}
