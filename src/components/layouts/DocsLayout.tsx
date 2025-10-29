import { ReactNode, useState } from 'react';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { DocsSidebar } from '../docs/DocsSidebar';
import { DocsMobileNav } from '../docs/DocsMobileNav';
import { useLanguage } from '../../contexts/LanguageContext';
import { Logo } from '../ui/Logo';

interface DocsLayoutProps {
  children: ReactNode;
  currentPage: string;
}

export function DocsLayout({ children, currentPage }: DocsLayoutProps) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background">
      <Sidebar
        isOpen={false}
        onToggle={() => {}}
        currentView="new"
        onViewChange={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 flex">
          <DocsSidebar currentPage={currentPage} />

          <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12 pb-20 overflow-y-auto">
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Logo size={32} />
                  <h1 className="text-2xl font-bold font-display text-text-primary">
                    {t['docs.title'] || '产品文档'}
                  </h1>
                </div>
                <DocsMobileNav
                  currentPage={currentPage}
                  isOpen={mobileMenuOpen}
                  onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
