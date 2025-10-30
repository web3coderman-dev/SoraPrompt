/**
 * Domain Redirect Utility
 * Ensures all authenticated sessions use the custom domain
 */

const CUSTOM_DOMAIN = 'soraprompt.studio';
const BOLT_DOMAIN = 'bolt.host';

/**
 * Get the preferred domain for the application
 */
export function getPreferredDomain(): string {
  return `https://${CUSTOM_DOMAIN}`;
}

/**
 * Check if current domain is the Bolt.host domain
 */
export function isBoltDomain(): boolean {
  return window.location.hostname.includes(BOLT_DOMAIN);
}

/**
 * Check if current domain is the custom domain
 */
export function isCustomDomain(): boolean {
  return window.location.hostname === CUSTOM_DOMAIN;
}

/**
 * Get the current full URL on the custom domain
 */
export function getCustomDomainUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getPreferredDomain()}${cleanPath}`;
}

/**
 * Redirect to custom domain if currently on Bolt domain
 * Preserves the current path and query parameters
 */
export function redirectToCustomDomain(): void {
  if (isBoltDomain()) {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const customUrl = getCustomDomainUrl(`${currentPath}${currentSearch}`);

    console.log(`Redirecting from Bolt domain to custom domain: ${customUrl}`);
    window.location.replace(customUrl);
  }
}

/**
 * Get OAuth redirect URL with custom domain
 */
export function getOAuthRedirectUrl(): string {
  // Always use custom domain for OAuth redirects
  return getCustomDomainUrl('/auth/callback');
}

/**
 * Get base URL for the application
 * Returns custom domain if available, otherwise current origin
 */
export function getBaseUrl(): string {
  // In production, always prefer custom domain
  if (import.meta.env.PROD) {
    return getPreferredDomain();
  }
  // In development, use current origin
  return window.location.origin;
}

/**
 * Initialize domain redirect check
 * Should be called early in the application lifecycle
 */
export function initDomainRedirect(): void {
  // Only redirect if we're in production and not already on custom domain
  if (import.meta.env.PROD && isBoltDomain()) {
    console.log('Detected Bolt domain, checking if redirect is needed...');

    // Don't redirect during OAuth callback to avoid breaking the flow
    // The callback page will handle the redirect after processing
    if (!window.location.pathname.includes('/auth/callback')) {
      redirectToCustomDomain();
    }
  }
}
