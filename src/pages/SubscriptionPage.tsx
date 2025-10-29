import { SubscriptionPlans } from '../components/SubscriptionPlans';
import { PageContainer } from '../components/layouts/PageContainer';

export default function SubscriptionPage() {
  return (
    <PageContainer maxWidth="2xl">
      <SubscriptionPlans />
    </PageContainer>
  );
}
