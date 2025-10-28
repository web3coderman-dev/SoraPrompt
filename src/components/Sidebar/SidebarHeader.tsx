import { Logo } from '../ui/Logo';

export default function SidebarHeader() {
  return (
    <div className="p-6 border-b border-keyLight/20">
      <div className="flex items-center gap-3 min-w-0">
        <Logo size={32} className="flex-shrink-0" />
        <h2 className="text-xl font-bold font-display text-text-primary whitespace-nowrap">
          SoraPrompt
        </h2>
      </div>
    </div>
  );
}
