/**
 * Analytics Filter Utility
 *
 * Helps filter developer traffic from analytics data
 */

const DEV_IDENTIFIER_KEY = 'soraprompt_dev_mode';
const DEV_URL_PARAM = 'dev';

/**
 * Check if current user is in dev mode
 */
export function isDevMode(): boolean {
  // Check localStorage
  if (typeof window !== 'undefined') {
    const devFlag = localStorage.getItem(DEV_IDENTIFIER_KEY);
    if (devFlag === 'true') {
      return true;
    }

    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(DEV_URL_PARAM)) {
      return true;
    }
  }

  return false;
}

/**
 * Enable dev mode to filter analytics
 * Usage: Add ?dev=alex to any URL or call this function
 */
export function enableDevMode(identifier?: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(DEV_IDENTIFIER_KEY, 'true');
  if (identifier) {
    localStorage.setItem('dev_identifier', identifier);
  }

  console.log('🔧 Dev mode enabled - Analytics filtering active');
}

/**
 * Disable dev mode
 */
export function disableDevMode(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(DEV_IDENTIFIER_KEY);
  localStorage.removeItem('dev_identifier');

  console.log('✅ Dev mode disabled - Analytics tracking active');
}

/**
 * Get dev identifier if set
 */
export function getDevIdentifier(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dev_identifier');
}

/**
 * Auto-detect and enable dev mode from URL
 */
export function initDevMode(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const devParam = urlParams.get(DEV_URL_PARAM);

  if (devParam) {
    enableDevMode(devParam);

    // Clean URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete(DEV_URL_PARAM);
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Filter analytics events - return false to prevent tracking
 */
export function shouldTrackEvent(): boolean {
  return !isDevMode();
}
