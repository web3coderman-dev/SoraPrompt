import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import AppLayout from './components/AppLayout';
import AuthCallback from './pages/AuthCallback';
import NewProject from './pages/NewProject';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import DocsPage from './pages/DocsPage';
import NotFound from './pages/NotFound';
import { ToastContainer } from './components/Toast';
import { ScrollToTop } from './components/ScrollToTop';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-keyLight animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/docs" element={<DocsPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/new" replace />} />
        <Route path="/new" element={<NewProject />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <AppRoutes />
            <ToastContainer />
          </SubscriptionProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
