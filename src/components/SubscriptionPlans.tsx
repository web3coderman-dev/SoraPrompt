import { Check, Sparkles, Zap, Film, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';
import { Button } from './ui/Button';
import { SubscriptionBadge } from './SubscriptionBadge';
import LoginModal from './LoginModal';
import { useState, useEffect } from 'react';
import { StripeService, STRIPE_PRICE_IDS } from '../lib/stripe';

export function SubscriptionPlans() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { subscription, upgradeSubscription, loading, refreshSubscription } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);
  const [targetTier, setTargetTier] = useState<SubscriptionTier | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const plans = [
    {
      tier: 'free' as SubscriptionTier,
      name: t.tierFreeName,
      price: t.tierFreePrice,
      credits: t.tierFreeCredits,
      icon: <Sparkles className="w-8 h-8" />,
      features: [
        t.featureQuickMode,
        t.featureDirectorMode,
        t.tierFreeCredits,
        t.featureUnlimitedHistory,
        t.featureSameAI,
      ],
      color: 'from-[#9CA3AF] to-[#6B7280]',
      textColor: 'text-white',
    },
    {
      tier: 'creator' as SubscriptionTier,
      name: t.tierCreatorName,
      price: t.tierCreatorPrice,
      credits: t.tierCreatorCredits,
      icon: <Zap className="w-8 h-8" />,
      features: [
        t.featureQuickMode,
        t.featureDirectorMode,
        t.tierCreatorCredits,
        t.featureUnlimitedHistory,
        t.featureSameAI,
        t.featureBadge,
      ],
      color: 'from-[#45E0A2] to-[#3DD598]',
      textColor: 'text-white',
      popular: true,
    },
    {
      tier: 'director' as SubscriptionTier,
      name: t.tierDirectorName,
      price: t.tierDirectorPrice,
      credits: t.tierDirectorCredits,
      icon: <Film className="w-8 h-8" />,
      features: [
        t.featureQuickMode,
        t.featureDirectorMode,
        t.tierDirectorCredits,
        t.featureUnlimitedHistory,
        t.featureSameAI,
        t.featurePrioritySupport,
        t.featureBadge,
      ],
      color: 'from-[#3A6CFF] to-[#2D5AE8]',
      textColor: 'text-white',
    },
  ];

  const getTierName = (tier: SubscriptionTier) => {
    const plan = plans.find(p => p.tier === tier);
    return plan?.name || tier;
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) {
      setTargetTier(tier);
      setShowLoginModal(true);
      return;
    }

    if (tier === 'free') {
      setUpgrading(true);
      try {
        await upgradeSubscription(tier);
        const message = t.subscriptionSwitchedToFree;
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message, type: 'success' }
        }));
      } catch (error) {
        const message = t.subscriptionSwitchFailed;
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message, type: 'error' }
        }));
      } finally {
        setUpgrading(false);
      }
      return;
    }

    setProcessingPayment(true);
    try {
      const priceId = tier === 'creator' ? STRIPE_PRICE_IDS.pro_monthly : STRIPE_PRICE_IDS.director_monthly;
      const planType = tier === 'creator' ? 'pro' : 'director';

      await StripeService.redirectToCheckout(priceId, planType);
    } catch (error) {
      console.error('Payment error:', error);
      const message = t.subscriptionPaymentFailed;
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type: 'error' }
      }));
      setProcessingPayment(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      setProcessingPayment(true);
      await StripeService.redirectToPortal();
    } catch (error) {
      console.error('Portal error:', error);
      const message = t.subscriptionPortalFailed;
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type: 'error' }
      }));
      setProcessingPayment(false);
    }
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    if (user && targetTier) {
      const timer = setTimeout(() => {
        handleUpgrade(targetTier);
        setTargetTier(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, targetTier]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const canceled = params.get('canceled');

    if (sessionId) {
      const message = t.subscriptionPaymentSuccess;
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type: 'success' }
      }));
      refreshSubscription();
      window.history.replaceState({}, '', '/dashboard');
    } else if (canceled) {
      const message = t.subscriptionPaymentCanceled;
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type: 'info' }
      }));
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [language, refreshSubscription]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-display text-text-primary mb-4">{t.subscriptionTitle}</h2>
        <p className="text-lg text-text-secondary">
          {user && subscription ? (
            <span className="flex flex-col items-center gap-3">
              <span className="inline-flex items-center gap-2">
                {t.subscriptionCurrent}:{' '}
                <SubscriptionBadge tier={subscription.tier} size="md" />
              </span>
              {subscription.stripe_subscription_id && subscription.subscription_status === 'active' && (
                <Button
                  variant="scene"
                  size="sm"
                  onClick={handleManageSubscription}
                  disabled={processingPayment}
                  className="gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {t.subscriptionManageBilling}
                </Button>
              )}
            </span>
          ) : (
            t.subscriptionSubtitle
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => {
          const isCurrentPlan = user && subscription?.tier === plan.tier;

          return (
            <div key={plan.tier} className="relative pt-6">
              {plan.popular && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-rimLight to-[#D68722] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-rim">
                    {t.subscriptionPopularTag}
                  </span>
                </div>
              )}

              <div
                className={`
                  relative rounded-2xl p-8 transition-all duration-300 overflow-hidden
                  ${
                    plan.popular
                      ? 'border-2 border-keyLight shadow-key scale-105'
                      : 'border border-keyLight/20 shadow-depth-lg'
                  }
                  bg-scene-fill hover:shadow-key hover:border-keyLight/40 group
                `}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-keyLight/5 to-transparent rounded-full blur-2xl translate-x-1/4 -translate-y-1/4 group-hover:from-keyLight/10 transition-all duration-300" />

              <div className="relative z-10 flex flex-col items-center text-center mb-6">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${plan.color} ${plan.textColor} mb-4 shadow-depth-md group-hover:shadow-depth-lg transition-shadow duration-300`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold font-display text-text-primary mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-text-primary">{plan.price.split('/')[0]}</span>
                  {plan.price.includes('/') && (
                    <span className="text-text-tertiary">/{plan.price.split('/')[1]}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-text-secondary">{plan.credits}</p>
              </div>

              <ul className="relative z-10 space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                    <Check className="w-5 h-5 text-[#45E0A2] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="relative z-10">
                {plan.tier === 'free' ? (
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={upgrading || processingPayment || isCurrentPlan}
                    variant={isCurrentPlan ? 'preview' : 'scene'}
                    fullWidth
                  >
                    {isCurrentPlan ? t.subscriptionCurrent : t.subscriptionUpgrade}
                  </Button>
                ) : plan.tier === 'creator' ? (
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={upgrading || processingPayment || isCurrentPlan}
                    variant={isCurrentPlan ? 'preview' : 'rim'}
                    fullWidth
                    className="gap-2"
                  >
                    {processingPayment && !isCurrentPlan ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        {t.subscriptionProcessing}
                      </>
                    ) : (
                      <>
                        {!isCurrentPlan && <CreditCard className="w-4 h-4" />}
                        {isCurrentPlan ? t.subscriptionCurrent : t.subscriptionSubscribeAndPay}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={upgrading || processingPayment || isCurrentPlan}
                    variant={isCurrentPlan ? 'preview' : 'director'}
                    fullWidth
                    className="gap-2"
                  >
                    {processingPayment && !isCurrentPlan ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        {t.subscriptionProcessing}
                      </>
                    ) : (
                      <>
                        {!isCurrentPlan && <CreditCard className="w-4 h-4" />}
                        {isCurrentPlan ? t.subscriptionCurrent : t.subscriptionSubscribeAndPay}
                      </>
                    )}
                  </Button>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-text-tertiary">
        <p>{t.featureSameAI}</p>
        <p className="mt-2">{t.privacyPolicy}</p>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={handleLoginClose}
          context={{
            title: t.subscriptionLoginToSubscribe,
            message: targetTier
              ? t.subscriptionLoginMessage.replace('{{plan}}', getTierName(targetTier))
              : undefined
          }}
        />
      )}
    </div>
  );
}
