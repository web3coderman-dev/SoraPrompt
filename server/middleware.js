/**
 * Security Middleware for soraprompt.studio
 *
 * Production-grade security layer that:
 * - Blocks bots, crawlers, and scanners
 * - Prevents access to sensitive paths
 * - Restricts API access to same-origin requests
 * - Rate limiting to prevent abuse
 * - Maintains clean analytics data
 */

const rateLimitMap = new Map();

function cleanupRateLimitMap() {
  const now = Date.now();
  const windowMs = 60 * 1000;

  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.start > windowMs * 2) {
      rateLimitMap.delete(key);
    }
  }
}

setInterval(cleanupRateLimitMap, 120 * 1000);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';
  const ip = request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

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

  // 5️⃣ Rate Limiting: 每IP每分钟最多30次请求
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;
  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start < windowMs) {
    record.count++;
    if (record.count > maxRequests) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain',
          'Retry-After': '60',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0'
        }
      });
    }
  } else {
    record.count = 1;
    record.start = now;
  }
  rateLimitMap.set(ip, record);

  // 6️⃣ Block requests with no user agent (common in automated attacks)
  if (!ua || ua.length < 10) {
    return new Response('Bad Request', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // 7️⃣ Allow legitimate traffic
  return next();
}
