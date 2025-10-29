import { useLanguage } from '../contexts/LanguageContext';

export function MinimalFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 text-center border-t border-border-subtle">
      <p className="text-sm text-text-secondary">
        {t['footer.copyright'] || `© ${currentYear} SoraPrompt Studio. All rights reserved.`}
      </p>
    </footer>
  );
}
