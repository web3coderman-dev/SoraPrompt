import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-scene-fill rounded-2xl shadow-depth-lg border border-keyLight/20 p-12 text-center">
      <Icon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
