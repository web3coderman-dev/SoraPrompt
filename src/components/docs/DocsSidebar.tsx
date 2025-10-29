import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Lightbulb, HelpCircle, Clock } from 'lucide-react';

interface DocsSidebarProps {
  currentPage: string;
}

export function DocsSidebar({ currentPage }: DocsSidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'quick-start',
      label: t['docs.quickStart'] || '快速开始',
      icon: Lightbulb,
    },
    {
      id: 'features',
      label: t['docs.features'] || '功能说明',
      icon: BookOpen,
    },
    {
      id: 'faq',
      label: t['docs.faq'] || '常见问题',
      icon: HelpCircle,
    },
    {
      id: 'changelog',
      label: t['docs.changelog'] || '更新日志',
      icon: Clock,
    },
  ];

  return (
    <aside className="hidden lg:block w-64 border-r border-border-subtle bg-scene-fill/30 overflow-y-auto">
      <div className="sticky top-0 px-6 py-8">
        <h2 className="text-lg font-bold font-display text-text-primary mb-6">
          {t['docs.title'] || '产品文档'}
        </h2>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Link
                key={item.id}
                to={`/docs?page=${item.id}`}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-keyLight text-white shadow-key'
                      : 'text-text-secondary hover:text-text-primary hover:bg-scene-fillLight'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
