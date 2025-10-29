import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Lightbulb, HelpCircle, Clock, Menu, X } from 'lucide-react';

interface DocsMobileNavProps {
  currentPage: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function DocsMobileNav({ currentPage, isOpen, onToggle }: DocsMobileNavProps) {
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
    <div className="lg:hidden">
      <button
        onClick={onToggle}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute right-4 top-20 w-64 bg-scene-fill border border-border-subtle rounded-lg shadow-depth-lg z-50">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <Link
                  key={item.id}
                  to={`/docs?page=${item.id}`}
                  onClick={onToggle}
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
      )}
    </div>
  );
}
