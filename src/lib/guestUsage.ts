import { getOrGenerateFingerprint } from './fingerprint';

export interface GuestUsage {
  count: number;
  resetDate: string;
  sessionId: string;
  fingerprint?: string;
  firstVisit: string;
  lastUsed: string;
}

const STORAGE_KEY = 'soraprompt_guest_usage';
const SESSION_KEY = 'soraprompt_session_id';
const DAILY_GUEST_CREDITS = 2;

function generateSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

async function initFingerprint(usage: GuestUsage): Promise<GuestUsage> {
  if (!usage.fingerprint) {
    try {
      const fingerprint = await getOrGenerateFingerprint();
      usage.fingerprint = fingerprint;
      saveGuestUsage(usage);
    } catch (error) {
      console.error('Failed to generate fingerprint:', error);
    }
  }
  return usage;
}

function getGuestUsage(): GuestUsage {
  const stored = localStorage.getItem(STORAGE_KEY);
  const today = getTodayDate();

  if (!stored) {
    const newUsage: GuestUsage = {
      count: 0,
      resetDate: today,
      sessionId: getSessionId(),
      firstVisit: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
    initFingerprint(newUsage);
    return newUsage;
  }

  const usage: GuestUsage = JSON.parse(stored);

  if (usage.resetDate !== today) {
    usage.count = 0;
    usage.resetDate = today;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  }

  if (!usage.fingerprint) {
    initFingerprint(usage);
  }

  return usage;
}

function saveGuestUsage(usage: GuestUsage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

export function getGuestCredits(): number {
  const usage = getGuestUsage();
  return Math.max(0, DAILY_GUEST_CREDITS - usage.count);
}

export function hasGuestCredits(cost: number = 1): boolean {
  return getGuestCredits() >= cost;
}

export function deductGuestCredits(cost: number = 1): boolean {
  const usage = getGuestUsage();

  if (usage.count + cost > DAILY_GUEST_CREDITS) {
    return false;
  }

  usage.count += cost;
  usage.lastUsed = new Date().toISOString();
  saveGuestUsage(usage);

  return true;
}

export function getGuestUsageStats(): {
  used: number;
  total: number;
  remaining: number;
  resetDate: string;
  nextResetTime: string;
} {
  const usage = getGuestUsage();
  const nextReset = new Date();
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);

  return {
    used: usage.count,
    total: DAILY_GUEST_CREDITS,
    remaining: Math.max(0, DAILY_GUEST_CREDITS - usage.count),
    resetDate: usage.resetDate,
    nextResetTime: nextReset.toISOString(),
  };
}

export function clearGuestUsage(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function shouldPromptRegistration(): 'no_credits' | 'frequent_user' | null {
  const usage = getGuestUsage();

  if (usage.count >= DAILY_GUEST_CREDITS) {
    return 'no_credits';
  }

  if (usage.count >= 1) {
    return 'frequent_user';
  }

  return null;
}

export function getGuestConversionTrigger(): {
  type: 'no_credits' | 'frequent_user' | 'director_locked' | 'history_locked' | null;
  shouldShow: boolean;
  message?: string;
} {
  const usage = getGuestUsage();

  if (usage.count >= DAILY_GUEST_CREDITS) {
    return {
      type: 'no_credits',
      shouldShow: true,
      message: 'Today\'s trial credits used up! Register for 3 daily generations.',
    };
  }

  if (usage.count >= 1) {
    return {
      type: 'frequent_user',
      shouldShow: true,
      message: 'Enjoying SoraPrompt? Register to get 3 free generations daily!',
    };
  }

  return {
    type: null,
    shouldShow: false,
  };
}

export async function getFingerprint(): Promise<string | undefined> {
  const usage = getGuestUsage();
  if (!usage.fingerprint) {
    try {
      const fingerprint = await getOrGenerateFingerprint();
      usage.fingerprint = fingerprint;
      saveGuestUsage(usage);
      return fingerprint;
    } catch (error) {
      console.error('Failed to get fingerprint:', error);
      return undefined;
    }
  }
  return usage.fingerprint;
}
