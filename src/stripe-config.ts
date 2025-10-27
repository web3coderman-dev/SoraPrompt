export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TJTkEEUUDGgh4C',
    priceId: 'price_1SMqmsDigDseMpkU1Jc3pYnI',
    name: 'SoraPrompt',
    description: 'Premium access to SoraPrompt features',
    price: 19.00,
    currency: 'usd',
    mode: 'subscription'
  }
];

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}