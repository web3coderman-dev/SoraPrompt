import { SubscriptionPlans } from '../components/SubscriptionPlans';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background">
      <div className="container mx-auto px-4 py-8">
        <SubscriptionPlans />
      </div>
    </div>
  );
}
