import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { 
      email, 
      tier = 'free',
      referral_code,
      utm_source,
      utm_medium,
      utm_campaign 
    } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_KEY') ?? '',
    );

    // Get IP and user agent for analytics
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                      req.headers.get('cf-connecting-ip') || 
                      'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Check if email already exists
    const { data: existingEntry } = await supabaseClient
      .from('waitlist')
      .select('id, email, tier, waitlist_number, referral_code')
      .eq('email', email.toLowerCase())
      .single();

    if (existingEntry) {
      // User already on waitlist, return their info
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'You are already on the waitlist!',
          data: {
            waitlist_number: existingEntry.waitlist_number,
            tier: existingEntry.tier,
            referral_code: existingEntry.referral_code
          },
          already_registered: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Validate referral code if provided
    let referredBy = null;
    if (referral_code) {
      const { data: referrer } = await supabaseClient
        .from('waitlist')
        .select('referral_code')
        .eq('referral_code', referral_code)
        .single();
      
      if (referrer) {
        referredBy = referral_code;
      }
    }

    // Insert new waitlist entry
    const { data: newEntry, error: insertError } = await supabaseClient
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        tier: tier,
        status: tier === 'pro' ? 'pending_payment' : 'active',
        referred_by: referredBy,
        ip_address: ipAddress,
        user_agent: userAgent,
        utm_source: utm_source,
        utm_medium: utm_medium,
        utm_campaign: utm_campaign
      })
      .select('id, email, tier, waitlist_number, referral_code, status')
      .single();

    if (insertError) {
      console.error('Error inserting waitlist entry:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to join waitlist. Please try again.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Get total count for social proof
    const { count: totalCount } = await supabaseClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Welcome to the Pulse ${tier} waitlist!`,
        data: {
          waitlist_number: newEntry.waitlist_number,
          tier: newEntry.tier,
          referral_code: newEntry.referral_code,
          status: newEntry.status
        },
        total_signups: totalCount || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing waitlist signup:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
