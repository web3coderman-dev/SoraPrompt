/**
 * Secure API Endpoint
 *
 * 演示如何验证 API Key 保护敏感接口
 * 使用方法：在请求头中添加 x-api-key: your_secret_key
 */

export async function onRequest({ request }) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const validKey = process.env.PUBLIC_API_KEY;

    if (!validKey) {
      return new Response(JSON.stringify({
        error: 'Server missing API key configuration',
        code: 'SERVER_ERROR'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!apiKey || apiKey !== validKey) {
      return new Response(JSON.stringify({
        error: 'Invalid API key',
        code: 'UNAUTHORIZED'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';

    const isValidOrigin = origin.includes('soraprompt.studio') || origin.includes('localhost');
    const isValidReferer = referer.includes('soraprompt.studio') || referer.includes('localhost');

    if (!isValidOrigin && !isValidReferer) {
      return new Response(JSON.stringify({
        error: 'Invalid origin',
        code: 'FORBIDDEN'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let body = null;
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        body = await request.json();
      } catch {
        body = null;
      }
    }

    const result = {
      status: 'success',
      message: 'Authorized access',
      timestamp: new Date().toISOString(),
      data: body
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
