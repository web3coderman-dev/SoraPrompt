import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-state-ok/10 border-state-ok/30 text-state-ok',
    error: 'bg-state-error/10 border-state-error/30 text-state-error',
    info: 'bg-state-info/10 border-state-info/30 text-state-info',
    warning: 'bg-state-warning/10 border-state-warning/30 text-state-warning',
  };

  const iconColors = {
    success: 'text-state-ok',
    error: 'text-state-error',
    info: 'text-state-info',
    warning: 'text-state-warning',
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-[100] max-w-md w-full
        animate-slide-in-right
        ${colors[type]}
        border rounded-lg shadow-depth-lg p-4
        flex items-start gap-3
      `}
    >
      <div className={iconColors[type]}>
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: 'success' | 'error' | 'info' | 'warning' }>;
      const { message, type = 'info' } = customEvent.detail;

      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
