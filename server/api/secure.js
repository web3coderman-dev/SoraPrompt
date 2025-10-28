/**
 * Secure API Endpoint Example
 *
 * Demonstrates how to validate API keys for sensitive operations
 */

export async function onRequestPost({ request, env }) {
  try {
    // Verify API key from headers
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = env.PUBLIC_API_KEY || import.meta.env.PUBLIC_API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
      return new Response(JSON.stringify({
        error: 'Invalid API key',
        code: 'UNAUTHORIZED'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Verify origin
    const origin = request.headers.get('origin') || '';
    if (!origin.includes('soraprompt.studio') && !origin.includes('localhost')) {
      return new Response(JSON.stringify({
        error: 'Invalid origin',
        code: 'FORBIDDEN'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Process request
    const body = await request.json();

    // Your secure logic here
    const result = {
      success: true,
      message: 'Request processed securely',
      data: body
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
