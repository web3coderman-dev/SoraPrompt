import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

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
  'free': 0,
  'pro': 100,
  'director': 500,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('Missing stripe-signature header');
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase.from('webhook_events').insert({
      event_id: event.id,
      event_type: event.type,
      payload: event as any,
      processed: false,
    });

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    await supabase
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('event_id', event.id);

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const planType = session.metadata?.plan_type as 'pro' | 'director' | 'free';

  if (!userId || !planType) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const credits = PLAN_CREDITS[planType] || 0;

  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      tier: planType,
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      remaining_credits: credits,
      total_credits: credits,
      reset_cycle: 'monthly',
      renewal_date: new Date(subscription.current_period_end * 1000).toISOString(),
    });

  await supabase.from('payment_history').insert({
    user_id: userId,
    stripe_payment_intent_id: session.payment_intent as string,
    amount: session.amount_total || 0,
    currency: session.currency || 'usd',
    status: 'succeeded',
    plan_type: planType,
    description: `Subscription to ${planType} plan`,
    metadata: { session_id: session.id },
  });

  console.log(`Checkout completed for user ${userId}, plan: ${planType}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  const planType = subscription.metadata?.plan_type as 'pro' | 'director' | 'free';

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  const credits = PLAN_CREDITS[planType] || 0;

  await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscription.id,
      tier: planType || 'free',
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      remaining_credits: credits,
      total_credits: credits,
      renewal_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('user_id', userId);

  console.log(`Subscription updated for user ${userId}, status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      tier: 'free',
      subscription_status: 'canceled',
      cancel_at_period_end: false,
      remaining_credits: 0,
      total_credits: 0,
    })
    .eq('user_id', userId);

  console.log(`Subscription canceled for user ${userId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id, tier')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();

  if (!subscription) {
    console.error('Subscription not found for invoice');
    return;
  }

  await supabase.from('payment_history').insert({
    user_id: subscription.user_id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_invoice_id: invoice.id,
    stripe_charge_id: invoice.charge as string,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    plan_type: subscription.tier,
    description: `Payment for ${subscription.tier} plan`,
    metadata: { invoice_id: invoice.id },
  });

  console.log(`Invoice payment succeeded for user ${subscription.user_id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id, tier')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();

  if (!subscription) {
    console.error('Subscription not found for invoice');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      subscription_status: 'past_due',
    })
    .eq('user_id', subscription.user_id);

  await supabase.from('payment_history').insert({
    user_id: subscription.user_id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    plan_type: subscription.tier,
    description: `Failed payment for ${subscription.tier} plan`,
    metadata: { invoice_id: invoice.id },
  });

  console.log(`Invoice payment failed for user ${subscription.user_id}`);
}
