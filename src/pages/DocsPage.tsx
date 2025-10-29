import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocsLayout } from '../components/layouts/DocsLayout';
import { DocsContent } from '../components/docs/DocsContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function DocsPage() {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const page = searchParams.get('page') || 'quick-start';

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      try {
        const lang = language === 'zh' ? 'zh' : 'en';
        const response = await fetch(`/docs/${lang}/${page}.md`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent('# 文档未找到\n\n抱歉，请求的文档不存在。');
        }
      } catch (error) {
        console.error('Failed to load documentation:', error);
        setContent('# 加载失败\n\n文档加载失败，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, [page, language]);

  return (
    <DocsLayout currentPage={page}>
      <DocsContent content={content} loading={loading} />
    </DocsLayout>
  );
}
