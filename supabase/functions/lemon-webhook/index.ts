import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Signature",
};

const LEMON_WEBHOOK_SECRET = Deno.env.get('LEMON_WEBHOOK_SECRET')!;

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

const PLAN_CREDITS: Record<string, number> = {
  creator: 100,
  director: 500,
};

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  return digest === signature;
}

async function handleOrderCreated(event: any) {
  const customData = event.meta?.custom_data;
  const userId = customData?.user_id;
  const planTier = customData?.plan_tier || 'creator';

  if (!userId) {
    console.error('No user_id in webhook data');
    return;
  }

  const credits = PLAN_CREDITS[planTier] || 100;

  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier: planTier,
      status: 'active',
      remaining_credits: credits,
      total_credits: credits,
      reset_cycle: 'monthly',
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lemon_customer_id: event.data?.attributes?.customer_id?.toString(),
      lemon_order_id: event.data?.id?.toString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  console.log(`Order created for user ${userId}, plan: ${planTier}`);
}

async function handleSubscriptionCreated(event: any) {
  const customData = event.meta?.custom_data;
  const userId = customData?.user_id;
  const planTier = customData?.plan_tier || 'creator';

  if (!userId) {
    console.error('No user_id in webhook data');
    return;
  }

  const credits = PLAN_CREDITS[planTier] || 100;
  const renewsAt = event.data?.attributes?.renews_at;

  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier: planTier,
      status: 'active',
      remaining_credits: credits,
      total_credits: credits,
      reset_cycle: 'monthly',
      renewal_date: renewsAt ? new Date(renewsAt).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lemon_customer_id: event.data?.attributes?.customer_id?.toString(),
      lemon_subscription_id: event.data?.id?.toString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  console.log(`Subscription created for user ${userId}, plan: ${planTier}`);
}

async function handleSubscriptionUpdated(event: any) {
  const subscriptionId = event.data?.id?.toString();
  const status = event.data?.attributes?.status;
  const renewsAt = event.data?.attributes?.renews_at;

  if (!subscriptionId) {
    console.error('No subscription_id in webhook data');
    return;
  }

  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('user_id, tier')
    .eq('lemon_subscription_id', subscriptionId)
    .maybeSingle();

  if (!existingSubscription) {
    console.error(`No subscription found for lemon_subscription_id: ${subscriptionId}`);
    return;
  }

  const updateData: any = {
    status: status || 'active',
    updated_at: new Date().toISOString(),
  };

  if (renewsAt) {
    updateData.renewal_date = new Date(renewsAt).toISOString();
  }

  await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('lemon_subscription_id', subscriptionId);

  console.log(`Subscription updated: ${subscriptionId}, status: ${status}`);
}

async function handleSubscriptionCancelled(event: any) {
  const subscriptionId = event.data?.id?.toString();

  if (!subscriptionId) {
    console.error('No subscription_id in webhook data');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_subscription_id', subscriptionId);

  console.log(`Subscription cancelled: ${subscriptionId}`);
}

async function handleSubscriptionExpired(event: any) {
  const subscriptionId = event.data?.id?.toString();

  if (!subscriptionId) {
    console.error('No subscription_id in webhook data');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'expired',
      remaining_credits: 0,
      total_credits: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('lemon_subscription_id', subscriptionId);

  console.log(`Subscription expired: ${subscriptionId}`);
}

async function handleOrderRefunded(event: any) {
  const orderId = event.data?.id?.toString();

  if (!orderId) {
    console.error('No order_id in webhook data');
    return;
  }

  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('lemon_order_id', orderId)
    .maybeSingle();

  if (existingSubscription) {
    await supabase
      .from('subscriptions')
      .update({
        tier: 'free',
        status: 'refunded',
        remaining_credits: 0,
        total_credits: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('lemon_order_id', orderId);

    console.log(`Order refunded: ${orderId}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get('x-signature');
    const payload = await req.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!verifySignature(payload, signature, LEMON_WEBHOOK_SECRET)) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const event = JSON.parse(payload);
    const eventName = event.meta?.event_name;

    console.log(`Received webhook: ${eventName}`);

    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(event);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(event);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(event);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event);
        break;
      case 'subscription_expired':
        await handleSubscriptionExpired(event);
        break;
      case 'order_refunded':
        await handleOrderRefunded(event);
        break;
      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
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
