export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  properties?: Record<string, any>;
}

export interface ConversionFunnelData {
  guestVisits: number;
  guestGenerations: number;
  registerModalShown: number;
  registrations: number;
  firstGeneration: number;
  upgrades: number;
}

const STORAGE_KEY = 'soraprompt_analytics';

function getAnalyticsData(): AnalyticsEvent[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse analytics data:', error);
    return [];
  }
}

function saveAnalyticsEvent(event: AnalyticsEvent): void {
  const events = getAnalyticsData();
  events.push(event);

  const maxEvents = 1000;
  if (events.length > maxEvents) {
    events.splice(0, events.length - maxEvents);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  const event: AnalyticsEvent = {
    event: eventName,
    timestamp: Date.now(),
    properties,
  };

  saveAnalyticsEvent(event);

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
}

export function trackGuestVisit(): void {
  const events = getAnalyticsData();
  const hasTracked = events.some(e => e.event === 'guest_visit');

  if (!hasTracked) {
    trackEvent('guest_visit', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });
  }
}

export function trackGuestGeneration(mode: string): void {
  trackEvent('guest_generation', {
    mode,
    timestamp: Date.now(),
  });
}

export function trackRegisterModalShown(reason: string): void {
  trackEvent('register_modal_shown', {
    reason,
    timestamp: Date.now(),
  });
}

export function trackRegistration(method: string): void {
  trackEvent('registration', {
    method,
    timestamp: Date.now(),
  });
}

export function trackFirstGeneration(mode: string): void {
  trackEvent('first_generation_authenticated', {
    mode,
    timestamp: Date.now(),
  });
}

export function trackUpgrade(fromTier: string, toTier: string): void {
  trackEvent('upgrade', {
    fromTier,
    toTier,
    timestamp: Date.now(),
  });
}

export function getConversionFunnelData(): ConversionFunnelData {
  const events = getAnalyticsData();

  return {
    guestVisits: events.filter(e => e.event === 'guest_visit').length,
    guestGenerations: events.filter(e => e.event === 'guest_generation').length,
    registerModalShown: events.filter(e => e.event === 'register_modal_shown').length,
    registrations: events.filter(e => e.event === 'registration').length,
    firstGeneration: events.filter(e => e.event === 'first_generation_authenticated').length,
    upgrades: events.filter(e => e.event === 'upgrade').length,
  };
}

export function getConversionRates(): {
  guestToRegister: number;
  registerToFirstGen: number;
  freeToUpgrade: number;
} {
  const funnel = getConversionFunnelData();

  return {
    guestToRegister: funnel.guestVisits > 0
      ? (funnel.registrations / funnel.guestVisits) * 100
      : 0,
    registerToFirstGen: funnel.registrations > 0
      ? (funnel.firstGeneration / funnel.registrations) * 100
      : 0,
    freeToUpgrade: funnel.registrations > 0
      ? (funnel.upgrades / funnel.registrations) * 100
      : 0,
  };
}

export function getModalEffectiveness(): Record<string, {
  shown: number;
  conversions: number;
  rate: number;
}> {
  const events = getAnalyticsData();
  const modalEvents = events.filter(e => e.event === 'register_modal_shown');
  const registrations = events.filter(e => e.event === 'registration');

  const reasons = ['no_credits', 'frequent_user', 'director_locked', 'history_locked'];
  const effectiveness: Record<string, { shown: number; conversions: number; rate: number }> = {};

  for (const reason of reasons) {
    const shown = modalEvents.filter(e => e.properties?.reason === reason).length;
    const lastModalTime = modalEvents
      .filter(e => e.properties?.reason === reason)
      .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp || 0;

    const conversionsAfterModal = registrations.filter(
      e => e.timestamp > lastModalTime && e.timestamp < lastModalTime + 3600000
    ).length;

    effectiveness[reason] = {
      shown,
      conversions: conversionsAfterModal,
      rate: shown > 0 ? (conversionsAfterModal / shown) * 100 : 0,
    };
  }

  return effectiveness;
}

export function clearAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportAnalytics(): string {
  const events = getAnalyticsData();
  const funnel = getConversionFunnelData();
  const rates = getConversionRates();
  const effectiveness = getModalEffectiveness();

  return JSON.stringify({
    events,
    funnel,
    rates,
    effectiveness,
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
