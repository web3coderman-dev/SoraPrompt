import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';

export function SuccessPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main app after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your subscription. Your account has been upgraded and you now have access to all premium features.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Continue to App
        </button>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          You will be redirected automatically in a few seconds...
        </p>
      </div>
    </div>
  );
}