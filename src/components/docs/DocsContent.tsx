import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';

interface DocsContentProps {
  content: string;
  loading?: boolean;
}

export function DocsContent({ content, loading }: DocsContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-keyLight animate-spin" />
      </div>
    );
  }

  return (
    <article className="docs-content prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-6 mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-4 mt-8 pb-2 border-b border-border-subtle">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-base text-text-secondary leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-keyLight hover:text-keyLight/80 underline transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-scene-fillLight text-rimLight rounded text-sm font-code">
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} block p-4 bg-scene-fillLight rounded-lg overflow-x-auto text-sm font-code`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-keyLight pl-4 italic text-text-secondary my-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-border-subtle">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-scene-fillLight">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border-subtle">{children}</tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-text-secondary">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-border-subtle" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-text-primary">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
