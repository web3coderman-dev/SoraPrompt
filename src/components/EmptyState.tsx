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
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-scene-fillLight rounded-2xl flex items-center justify-center border border-keyLight/10">
          <Icon className="w-8 h-8 text-text-tertiary" />
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-display text-text-primary">{title}</h3>
          <p className="text-text-secondary text-base leading-relaxed">{description}</p>
        </div>

        {/* Action */}
        {action && <div className="w-full">{action}</div>}
      </div>
    </div>
  );
}
