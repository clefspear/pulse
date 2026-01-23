import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-customer-email',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const body = await req.json();
    const { price_id, user_id, user_email, return_url } = body;
    
    console.log('Create checkout request:', { price_id, user_email, return_url });
    
    const email = user_email || req.headers.get('X-Customer-Email');
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_KEY') ?? '',
    );

    // Add to waitlist if table exists
    let waitlistId = null;
    try {
      const { data: waitlistEntry, error: waitlistError } = await supabaseClient
        .from('waitlist')
        .insert({
          email: email,
          tier: 'pro',
          status: 'pending_payment'
        })
        .select()
        .single();

      if (!waitlistError) {
        waitlistId = waitlistEntry?.id;
      }
    } catch (e) {
      console.log('Waitlist table may not exist, continuing without it');
    }

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: user_id || '',
          waitlist_id: waitlistId || ''
        }
      });
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get('origin') || 'https://4f9cebe7-c9e4-40e6-ad25-4ed081b0e76b.canvases.tempo.build';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id || Deno.env.get('STRIPE_PRO_PRICE_ID') || 'price_placeholder',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: return_url ? `${return_url}?session_id={CHECKOUT_SESSION_ID}` : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        user_id: user_id || '',
        user_email: email,
        waitlist_id: waitlistId || ''
      },
      subscription_data: {
        metadata: {
          user_id: user_id || '',
          user_email: email,
        }
      },
      allow_promotion_codes: true,
    });

    // Update waitlist with stripe session if exists
    if (waitlistId) {
      try {
        await supabaseClient
          .from('waitlist')
          .update({ stripe_checkout_session_id: session.id })
          .eq('id', waitlistId);
      } catch (e) {
        console.log('Could not update waitlist entry');
      }
    }

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});