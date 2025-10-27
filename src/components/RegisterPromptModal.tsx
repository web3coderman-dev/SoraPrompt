import { UserPlus, Zap, History, Film, Cloud, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Modal, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { trackRegisterModalShown } from '../lib/analytics';

type TriggerReason = 'no_credits' | 'frequent_user' | 'director_locked' | 'history_locked';

interface RegisterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister?: () => void;
  reason?: TriggerReason;
}

const reasonConfig = {
  no_credits: {
    icon: Zap,
    titleKey: 'registerModal.noCredits.title',
    messageKey: 'registerModal.noCredits.message',
    defaultTitle: '🎬 Trial Credits Used Up',
    defaultMessage: 'You\'ve used all your trial credits for today! Register to get 3 free generations daily.',
  },
  frequent_user: {
    icon: Zap,
    titleKey: 'registerModal.frequentUser.title',
    messageKey: 'registerModal.frequentUser.message',
    defaultTitle: '🔥 You\'re on Fire!',
    defaultMessage: 'Loving SoraPrompt? Register to unlock 3 free daily generations and save your work forever!',
  },
  director_locked: {
    icon: Film,
    titleKey: 'registerModal.directorLocked.title',
    messageKey: 'registerModal.directorLocked.message',
    defaultTitle: '🎥 Director Mode is Premium',
    defaultMessage: 'Director Mode with full storyboard generation is exclusive to registered users.',
  },
  history_locked: {
    icon: History,
    titleKey: 'registerModal.historyLocked.title',
    messageKey: 'registerModal.historyLocked.message',
    defaultTitle: '💾 Save Your Creations',
    defaultMessage: 'Register to permanently save your prompt history and access it from any device.',
  },
};

const benefits = [
  {
    icon: Zap,
    titleKey: 'registerModal.benefit1.title',
    descKey: 'registerModal.benefit1.desc',
    defaultTitle: '3 Daily Generations',
    defaultDesc: '50% more than guest mode',
  },
  {
    icon: Cloud,
    titleKey: 'registerModal.benefit2.title',
    descKey: 'registerModal.benefit2.desc',
    defaultTitle: 'Cloud Sync',
    defaultDesc: 'Access your prompts anywhere',
  },
  {
    icon: History,
    titleKey: 'registerModal.benefit3.title',
    descKey: 'registerModal.benefit3.desc',
    defaultTitle: 'Forever History',
    defaultDesc: 'Never lose your creations',
  },
  {
    icon: Film,
    titleKey: 'registerModal.benefit4.title',
    descKey: 'registerModal.benefit4.desc',
    defaultTitle: 'Upgrade Ready',
    defaultDesc: 'Unlock Director Mode anytime',
  },
];

export function RegisterPromptModal({ isOpen, onClose, onRegister, reason = 'no_credits' }: RegisterPromptModalProps) {
  const { t } = useLanguage();

  const config = reasonConfig[reason];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen) {
      trackRegisterModalShown(reason);
    }
  }, [isOpen, reason]);

  const handleRegister = () => {
    onClose();
    if (onRegister) {
      onRegister();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      variant="glass"
    >
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-keyLight/20 to-neon/20 border border-keyLight/30">
            <Icon className="w-8 h-8 text-keyLight" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              {t[config.titleKey] || config.defaultTitle}
            </h2>
            <p className="text-text-secondary">
              {t[config.messageKey] || config.defaultMessage}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => {
            const BenefitIcon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-scene-fill border border-keyLight/10 hover:border-keyLight/20 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <BenefitIcon className="w-5 h-5 text-keyLight" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    {t[benefit.titleKey] || benefit.defaultTitle}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {t[benefit.descKey] || benefit.defaultDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-keyLight/5 to-neon/5 rounded-lg p-4 border border-keyLight/10">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-state-ok flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-text-primary font-medium mb-1">
                {t['registerModal.noCreditCard'] || '100% Free - No Credit Card Required'}
              </p>
              <p className="text-xs text-text-secondary">
                {t['registerModal.instantAccess'] || 'Get instant access to all Free tier features'}
              </p>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            {t['ui.modal.cancel'] || 'Maybe Later'}
          </Button>
          <Button
            variant="gradient"
            size="md"
            icon={UserPlus}
            onClick={handleRegister}
            className="shadow-neon"
          >
            {t['registerModal.registerButton'] || 'Register for Free'}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
