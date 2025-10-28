import { ReactNode } from 'react';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

interface LegalLayoutProps {
  children: ReactNode;
}

export function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-scene-bg via-scene-fill to-scene-fillLight">
      <Sidebar
        isOpen={false}
        onToggle={() => {}}
        currentView="new"
        onViewChange={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-x-hidden">
        <main className="flex-1 p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
