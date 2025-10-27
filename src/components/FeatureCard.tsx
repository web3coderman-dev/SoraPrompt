import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  text: string;
}

export function FeatureCard({ icon: Icon, iconColor, text }: FeatureCardProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-primary bg-scene-fill border border-keyLight/20 p-3 rounded-lg hover:border-keyLight/30 hover:bg-scene-fillLight transition-all duration-200">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span>{text}</span>
    </div>
  );
}
