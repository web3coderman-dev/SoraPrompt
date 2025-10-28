import Settings from '../components/Settings';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background">
      <div className="container mx-auto px-4 py-8">
        <Settings />
      </div>
    </div>
  );
}
