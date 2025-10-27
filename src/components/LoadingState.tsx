interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message, size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-2 border-neon border-t-transparent mx-auto mb-4 ${sizeClasses[size]}`}
          role="status"
          aria-label={message || 'Loading...'}
        />
        {message && <p className="text-text-secondary">{message}</p>}
      </div>
    </div>
  );
}
