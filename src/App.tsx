import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { PromptGenerator } from './components/PromptGenerator';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { SubscriptionPage } from './components/subscription/SubscriptionPage';
import { SuccessPage } from './components/subscription/SuccessPage';
import { AuthModal } from './components/auth/AuthModal';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <I18nProvider>
      <ThemeProvider>
        <Router>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar user={user} onAuthClick={openAuthModal} />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<PromptGenerator />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route 
                  path="/subscription" 
                  element={user ? <SubscriptionPage /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/subscription/success" 
                  element={user ? <SuccessPage /> : <Navigate to="/" />} 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          
          <AuthModal
            isOpen={authModal.isOpen}
            onClose={closeAuthModal}
            mode={authModal.mode}
            onModeChange={(mode) => setAuthModal({ isOpen: true, mode })}
          />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;