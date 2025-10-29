import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocsLayout } from '../components/layouts/DocsLayout';
import { DocsContent } from '../components/docs/DocsContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function DocsPage() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const page = searchParams.get('page') || 'quick-start';

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      try {
        const langMap: Record<string, string> = {
          'zh': 'zh',
          'en': 'en',
          'ja': 'ja',
          'es': 'es',
          'fr': 'fr',
          'de': 'de',
          'ko': 'ko'
        };

        const docLang = langMap[language] || 'en';
        let response = await fetch(`/docs/${docLang}/${page}.md`);

        // If the document is not found and the language is not English, try fallback to English
        if (!response.ok && docLang !== 'en') {
          console.log(`Document not found for ${docLang}, falling back to English`);
          response = await fetch(`/docs/en/${page}.md`);
        }

        if (response.ok) {
          const text = await response.text();

          // Check if we're actually loading HTML instead of Markdown (shouldn't happen now)
          if (text.startsWith('<!doctype') || text.startsWith('<!DOCTYPE')) {
            throw new Error('Received HTML instead of Markdown');
          }

          setContent(text);
        } else {
          setContent(`# ${t['docs.notFound'] || 'Documentation Not Found'}\n\n${t['docs.notFoundMessage'] || 'Sorry, the requested documentation does not exist.'}`);
        }
      } catch (error) {
        console.error('Failed to load documentation:', error);
        setContent(`# ${t['docs.loadError'] || 'Load Failed'}\n\n${t['docs.loadErrorMessage'] || 'Failed to load documentation. Please try again later.'}`);
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, [page, language, t]);

  return (
    <DocsLayout currentPage={page}>
      <DocsContent content={content} loading={loading} />
    </DocsLayout>
  );
}
