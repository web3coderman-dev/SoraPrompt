import { X, Check, Zap, Film } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import LoginModal from './LoginModal';
import { useState } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'credits_out' | 'frequent_use' | 'director_locked';
  usageData?: {
    used: number;
    total: number;
  };
}

export function UpgradeModal({ isOpen, onClose, reason = 'credits_out', usageData }: UpgradeModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { subscription, upgradeSubscription } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getTitleMessage = () => {
    switch (reason) {
      case 'credits_out':
        if (usageData) {
          return (t.upgradeModalCreditsOut || 'Used {{used}}/{{total}} today')
            .replace('{{used}}', String(usageData.used))
            .replace('{{total}}', String(usageData.total));
        }
        return t.upgradeModalCreditsOutTitle || t.upgradeModalCreditsOut;
      case 'frequent_use':
        return t.upgradeModalFrequentUse;
      case 'director_locked':
        return t.upgradeModalDirectorLocked;
      default:
        return t.upgradeModalTitle;
    }
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setUpgrading(true);
    try {
      const success = await upgradeSubscription(tier);
      if (success) {
        onClose();
      }
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      tier: 'creator' as SubscriptionTier,
      name: t.tierCreator || 'Creator',
      price: t.tierCreatorPrice || '$19/mo',
      credits: t.tierCreatorCredits || '1000 per month',
      icon: <Zap className="w-6 h-6" />,
      features: [
        (t.upgradeModalBenefit1 || '{{count}} generations per month').replace('{{count}}', '1000'),
        t.upgradeModalBenefit2 || 'Director mode (full version + storyboard script)',
        t.upgradeModalBenefit3 || 'Unlimited history storage',
        (t.upgradeModalBenefit4 || 'Premium {{tier}} badge').replace('{{tier}}', t.tierCreator || 'Creator'),
      ],
      color: 'from-green-400 to-emerald-500',
      borderColor: 'border-green-500',
    },
    {
      tier: 'director' as SubscriptionTier,
      name: t.tierDirector || 'Director',
      price: t.tierDirectorPrice || '$49/mo',
      credits: t.tierDirectorCredits || '3000 per month',
      icon: <Film className="w-6 h-6" />,
      features: [
        (t.upgradeModalBenefit1 || '{{count}} generations per month').replace('{{count}}', '3000'),
        t.upgradeModalBenefit2 || 'Director mode (full version + storyboard script)',
        t.upgradeModalBenefit3 || 'Unlimited history storage',
        (t.upgradeModalBenefit4 || 'Premium {{tier}} badge').replace('{{tier}}', t.tierDirector || 'Director'),
        t.featurePrioritySupport || 'Priority Support',
      ],
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500',
      recommended: true,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.upgradeModalTitle}>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">{getTitleMessage()}</p>
          <p className="text-sm text-gray-600">
            {subscription?.tier === 'free' && t.upgradeModalFrequentUse}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`
                relative rounded-xl p-6 border-2 transition-all
                ${plan.recommended ? plan.borderColor + ' shadow-lg' : 'border-gray-200'}
                hover:shadow-xl bg-white
              `}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color} text-white`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.credits}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={upgrading || subscription?.tier === plan.tier}
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
              >
                {upgrading
                  ? t['auth.processing']
                  : subscription?.tier === plan.tier
                  ? t.subscriptionCurrent
                  : t.subscriptionUpgrade}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500">
          {t.privacyPolicy}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </Modal>
  );
}
