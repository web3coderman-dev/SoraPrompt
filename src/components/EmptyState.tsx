import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-scene-fill rounded-2xl shadow-depth-lg border border-keyLight/20 p-12 text-center space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-text-tertiary/10 rounded-2xl blur-xl" />
          <div className="relative w-20 h-20 bg-scene-fillLight rounded-2xl flex items-center justify-center border border-keyLight/10">
            <Icon className="w-10 h-10 text-text-tertiary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-display text-text-primary">{title}</h3>
          <p className="text-text-secondary leading-relaxed max-w-md mx-auto">{description}</p>
        </div>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
