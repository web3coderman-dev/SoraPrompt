import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const LEMON_API_KEY = Deno.env.get('LEMON_API_KEY')!;
const LEMON_STORE_ID = Deno.env.get('LEMON_STORE_ID')!;
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface CheckoutRequest {
  planTier: 'creator' | 'director';
  billingCycle?: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

const VARIANT_IDS: Record<string, string> = {
  creator_monthly: Deno.env.get('LEMON_VARIANT_CREATOR') || '',
  director_monthly: Deno.env.get('LEMON_VARIANT_DIRECTOR') || '',
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { planTier, billingCycle = 'monthly', successUrl, cancelUrl }: CheckoutRequest = await req.json();

    if (!planTier || (planTier !== 'creator' && planTier !== 'director')) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan tier. Must be creator or director' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const variantKey = `${planTier}_${billingCycle}`;
    const variantId = VARIANT_IDS[variantKey];

    if (!variantId) {
      return new Response(
        JSON.stringify({ error: `Variant not configured for ${variantKey}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || APP_URL;

    const lemonResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEMON_API_KEY}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                user_id: user.id,
                plan_tier: planTier,
              },
            },
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            expires_at: null,
            preview: false,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!lemonResponse.ok) {
      const errorData = await lemonResponse.json();
      console.error('Lemon Squeezy API error:', errorData);
      return new Response(
        JSON.stringify({
          error: 'Failed to create checkout session',
          details: errorData,
        }),
        {
          status: lemonResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const lemonData = await lemonResponse.json();
    const checkoutUrl = lemonData.data?.attributes?.url;

    if (!checkoutUrl) {
      return new Response(
        JSON.stringify({ error: 'No checkout URL returned from Lemon Squeezy' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        tier: 'free',
        remaining_credits: 0,
        total_credits: 0,
        reset_cycle: 'monthly',
        renewal_date: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      });

    return new Response(
      JSON.stringify({
        url: checkoutUrl,
        sessionId: lemonData.data?.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
