import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { useI18n } from '../../hooks/useI18n';

interface SubscriptionCardProps {
  product: StripeProduct;
  isCurrentPlan?: boolean;
  onSubscribe: (priceId: string) => void;
  loading?: boolean;
}

export function SubscriptionCard({ product, isCurrentPlan, onSubscribe, loading }: SubscriptionCardProps) {
  const { t } = useI18n();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 ${
      isCurrentPlan ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {product.description}
        </p>
        <div className="mb-6">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            /{product.mode === 'subscription' ? 'month' : 'one-time'}
          </span>
        </div>
        
        {isCurrentPlan ? (
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
            <Check className="w-5 h-5 mr-2" />
            Current Plan
          </div>
        ) : (
          <button
            onClick={() => onSubscribe(product.priceId)}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe to ${product.name}`
            )}
          </button>
        )}
      </div>
    </div>
  );
}