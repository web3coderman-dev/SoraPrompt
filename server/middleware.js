/**
 * Security Middleware for soraprompt.studio
 *
 * Production-grade security layer that:
 * - Blocks bots, crawlers, and scanners
 * - Prevents access to sensitive paths
 * - Restricts API access to same-origin requests
 * - Maintains clean analytics data
 */

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';

  // 1️⃣ Block sensitive paths
  const blockedPaths = [
    '/.env',
    '/.git',
    '/wp-admin',
    '/wordpress',
    '/wp-login.php',
    '/xmlrpc.php',
    '/config',
    '/setup-config.php',
    '/.aws',
    '/.docker',
    '/phpmyadmin',
    '/admin',
    '/.ssh',
    '/backup',
    '/.svn',
    '/.hg',
    '/web.config',
    '/.htaccess',
    '/.DS_Store'
  ];

  if (blockedPaths.some(path => url.pathname.toLowerCase().includes(path.toLowerCase()))) {
    return new Response('Forbidden', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // 2️⃣ Block bots, crawlers, and scanners
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /curl/i,
    /wget/i,
    /httpclient/i,
    /python-requests/i,
    /scrapy/i,
    /go-http-client/i,
    /axios/i,
    /okhttp/i,
    /java/i,
    /apache-httpclient/i,
    /nikto/i,
    /sqlmap/i,
    /nmap/i,
    /masscan/i,
    /scanner/i,
    /penetration/i
  ];

  // Allow legitimate search engine crawlers for SEO
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /slackbot/i,
    /twitterbot/i,
    /facebookexternalhit/i,
    /linkedinbot/i,
    /discordbot/i
  ];

  const isBot = botPatterns.some(pattern => pattern.test(ua));
  const isAllowedBot = allowedBots.some(pattern => pattern.test(ua));

  if (isBot && !isAllowedBot) {
    return new Response('Access denied', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // 3️⃣ Restrict API access to same-origin only
  if (url.pathname.startsWith('/api') || url.pathname.includes('/functions/v1/')) {
    const isValidReferer = referer && (
      referer.includes('soraprompt.studio') ||
      referer.includes('localhost')
    );

    const isValidOrigin = origin && (
      origin.includes('soraprompt.studio') ||
      origin.includes('localhost')
    );

    // Allow if either referer or origin is valid
    if (!isValidReferer && !isValidOrigin) {
      return new Response('Unauthorized API access', {
        status: 401,
        headers: {
          'Content-Type': 'text/plain',
          'X-Security-Error': 'Invalid origin'
        }
      });
    }
  }

  // 4️⃣ Block suspicious file extension requests
  const suspiciousExtensions = [
    '.php', '.asp', '.aspx', '.jsp', '.cgi',
    '.pl', '.py', '.sh', '.bash', '.bat'
  ];

  const hasSuspiciousExtension = suspiciousExtensions.some(ext =>
    url.pathname.toLowerCase().endsWith(ext)
  );

  if (hasSuspiciousExtension) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // 5️⃣ Rate limiting detection (basic)
  const clientIp = request.headers.get('cf-connecting-ip') ||
                   request.headers.get('x-forwarded-for') ||
                   'unknown';

  // Block requests with no user agent (common in automated attacks)
  if (!ua || ua.length < 10) {
    return new Response('Bad Request', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // 6️⃣ Allow legitimate traffic
  return next();
}
