import { ReactNode } from 'react';
import Sidebar from '../Sidebar';
import { MinimalFooter } from '../MinimalFooter';

interface LegalLayoutProps {
  children: ReactNode;
}

export function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background">
      <Sidebar
        isOpen={false}
        onToggle={() => {}}
        currentView="new"
        onViewChange={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-x-hidden">
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        <MinimalFooter />
      </div>
    </div>
  );
}
