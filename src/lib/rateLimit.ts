interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lastRequest: number;
  windowStart: number;
}

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;
const MAX_REQUESTS_PER_DAY = 5;

const STORAGE_KEY = 'soraprompt_rate_limit';

function getRateLimitKey(identifier: string): string {
  return `${STORAGE_KEY}_${identifier}`;
}

function getTodayWindow(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const key = getRateLimitKey(identifier);
  const stored = localStorage.getItem(key);
  const todayWindow = getTodayWindow();
  const now = Date.now();

  if (!stored) {
    const record: RateLimitRecord = {
      count: 0,
      firstRequest: now,
      lastRequest: now,
      windowStart: todayWindow,
    };
    localStorage.setItem(key, JSON.stringify(record));

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_DAY,
      resetAt: todayWindow + RATE_LIMIT_WINDOW,
    };
  }

  const record: RateLimitRecord = JSON.parse(stored);

  if (record.windowStart !== todayWindow) {
    const newRecord: RateLimitRecord = {
      count: 0,
      firstRequest: now,
      lastRequest: now,
      windowStart: todayWindow,
    };
    localStorage.setItem(key, JSON.stringify(newRecord));

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_DAY,
      resetAt: todayWindow + RATE_LIMIT_WINDOW,
    };
  }

  const remaining = MAX_REQUESTS_PER_DAY - record.count;

  return {
    allowed: record.count < MAX_REQUESTS_PER_DAY,
    remaining: Math.max(0, remaining),
    resetAt: todayWindow + RATE_LIMIT_WINDOW,
  };
}

export function incrementRateLimit(identifier: string): boolean {
  const key = getRateLimitKey(identifier);
  const stored = localStorage.getItem(key);
  const now = Date.now();

  if (!stored) {
    return false;
  }

  const record: RateLimitRecord = JSON.parse(stored);

  if (record.count >= MAX_REQUESTS_PER_DAY) {
    return false;
  }

  record.count += 1;
  record.lastRequest = now;

  localStorage.setItem(key, JSON.stringify(record));

  return true;
}

export function getRateLimitStatus(identifier: string): {
  count: number;
  limit: number;
  remaining: number;
  resetAt: number;
  blocked: boolean;
} {
  const check = checkRateLimit(identifier);
  const key = getRateLimitKey(identifier);
  const stored = localStorage.getItem(key);

  if (!stored) {
    return {
      count: 0,
      limit: MAX_REQUESTS_PER_DAY,
      remaining: MAX_REQUESTS_PER_DAY,
      resetAt: check.resetAt,
      blocked: false,
    };
  }

  const record: RateLimitRecord = JSON.parse(stored);

  return {
    count: record.count,
    limit: MAX_REQUESTS_PER_DAY,
    remaining: Math.max(0, MAX_REQUESTS_PER_DAY - record.count),
    resetAt: check.resetAt,
    blocked: record.count >= MAX_REQUESTS_PER_DAY,
  };
}
