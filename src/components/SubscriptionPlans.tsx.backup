import { Check, Sparkles, Zap, Film } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';
import { Button } from './ui/Button';
import { SubscriptionBadge } from './SubscriptionBadge';
import { LoginPrompt } from './LoginPrompt';
import { useState } from 'react';

export function SubscriptionPlans() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { subscription, upgradeSubscription, loading } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setUpgrading(true);
    try {
      await upgradeSubscription(tier);
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      tier: 'free' as SubscriptionTier,
      name: t.tierFreeName,
      price: t.tierFreePrice,
      credits: t.tierFreeCredits,
      icon: <Sparkles className="w-8 h-8" />,
      features: [
        t.featureQuickMode,
        t.tierFreeCredits,
        t.featureUnlimitedHistory,
        t.featureSameAI,
      ],
      color: 'from-gray-100 to-gray-200',
      textColor: 'text-gray-700',
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
      color: 'from-green-400 to-emerald-500',
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
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-white',
    },
  ];

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.subscriptionTitle}</h2>
          <p className="text-lg text-gray-600">
            {language === 'zh'
              ? '登录后查看和管理您的订阅套餐'
              : 'Sign in to view and manage your subscription plans'
            }
          </p>
        </div>

        <LoginPrompt
          title={language === 'zh' ? '登录以访问订阅功能' : 'Sign in to access subscriptions'}
          message={language === 'zh'
            ? '登录后您可以查看所有订阅套餐、管理您的订阅并升级到更高的等级'
            : 'Sign in to view all subscription plans, manage your subscription, and upgrade to premium tiers'
          }
          benefits={[
            language === 'zh' ? '🌟 查看所有订阅套餐和价格' : '🌟 View all subscription plans and pricing',
            language === 'zh' ? '📊 管理您的当前订阅' : '📊 Manage your current subscription',
            language === 'zh' ? '⚡ 升级到 Creator 或 Director 套餐' : '⚡ Upgrade to Creator or Director plans',
            language === 'zh' ? '🎯 解锁更多生成次数和高级功能' : '🎯 Unlock more generations and premium features',
          ]}
        />

        <div className="mt-8 grid md:grid-cols-3 gap-4 opacity-60 pointer-events-none">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className="bg-white rounded-xl border border-gray-200 p-6 text-center"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} ${plan.textColor} mb-3`}>
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">{plan.price.split('/')[0]}</div>
              <p className="text-sm text-gray-600">{plan.credits}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.subscriptionTitle}</h2>
        <p className="text-lg text-gray-600">
          {subscription && (
            <span className="inline-flex items-center gap-2">
              {t.subscriptionCurrent}:{' '}
              <SubscriptionBadge tier={subscription.tier} size="md" />
            </span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.tier === plan.tier;

          return (
            <div
              key={plan.tier}
              className={`
                relative rounded-2xl p-8 transition-all
                ${
                  plan.popular
                    ? 'border-2 border-primary-500 shadow-2xl scale-105'
                    : 'border border-gray-200 shadow-lg'
                }
                bg-white hover:shadow-2xl
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Popular
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center text-center mb-6">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${plan.color} ${plan.textColor} mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price.split('/')[0]}</span>
                  {plan.price.includes('/') && (
                    <span className="text-gray-500">/{plan.price.split('/')[1]}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600">{plan.credits}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={upgrading || isCurrentPlan}
                className={`
                  w-full
                  ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                      : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                  }
                `}
              >
                {isCurrentPlan ? t.subscriptionCurrent : t.subscriptionUpgrade}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>{t.featureSameAI}</p>
        <p className="mt-2">{t.privacyPolicy}</p>
      </div>
    </div>
  );
}
