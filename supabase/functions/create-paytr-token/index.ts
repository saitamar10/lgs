// PayTR iFrame Token Creation Edge Function
// Creates a payment token for PayTR iFrame integration

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as base64Encode } from 'https://deno.land/std@0.208.0/encoding/base64.ts'

const ALLOWED_ORIGINS = [
  'https://lgscalis.com',
  'https://www.lgscalis.com',
  'https://lgscalis.com.tr',
  'https://www.lgscalis.com.tr',
  'https://tuascnmjgbarrtwlxzcx.supabase.co',
  'http://localhost:8080',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// HMAC-SHA256 helper
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return base64Encode(new Uint8Array(signature));
}

interface PaymentRequest {
  plan_type: 'plus' | 'premium';
}

const PLAN_PRICES: Record<string, { amount: number; name: string; duration: string }> = {
  plus: { amount: 4500, name: 'Plus Aylik', duration: '1 Ay' },
  premium: { amount: 45000, name: 'Plus Yillik', duration: '1 Yil' },
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Kimlik dogrulama basarisiz.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { plan_type } = body as PaymentRequest;

    // Validate plan type
    if (!plan_type || !['plus', 'premium'].includes(plan_type)) {
      return new Response(JSON.stringify({ error: 'Gecersiz plan tipi.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get PayTR credentials from environment
    const merchant_id = Deno.env.get('PAYTR_MERCHANT_ID');
    const merchant_key = Deno.env.get('PAYTR_MERCHANT_KEY');
    const merchant_salt = Deno.env.get('PAYTR_MERCHANT_SALT');

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('PayTR credentials not configured');
      return new Response(JSON.stringify({ error: 'Odeme sistemi yapilandirilmamis.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const plan = PLAN_PRICES[plan_type];
    const merchant_oid = `LGS${user.id.substring(0, 8).replace(/-/g, '')}${Date.now()}`;
    const email = user.email || 'kullanici@lgscalis.com';
    const payment_amount = plan.amount; // Kurus cinsinden (4900 = 49 TL)
    const currency = 'TL';
    const test_mode = '0'; // 0 = canli, 1 = test

    // User info
    const user_name = user.user_metadata?.display_name || 'LGS Calis Kullanici';
    const user_address = 'Turkiye';
    const user_phone = '05000000000';

    // Callback & return URLs
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const merchant_ok_url = 'https://lgscalis.com/payment-callback?status=success';
    const merchant_fail_url = 'https://lgscalis.com/payment-callback?status=failed';
    const paytr_callback_url = `${supabaseUrl}/functions/v1/paytr-callback`;

    // Basket - PayTR requires base64 encoded JSON array
    const basket = JSON.stringify([
      [plan.name, plan.amount.toString(), 1]
    ]);
    const user_basket = btoa(basket);

    // No installment
    const no_installment = '1';
    const max_installment = '0';

    // User IP
    const user_ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                    req.headers.get('cf-connecting-ip') ||
                    req.headers.get('x-real-ip') ||
                    '85.34.78.112';

    const timeout_limit = '30';
    const debug_on = '0';

    // Create hash string for token
    // PayTR hash: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hashStr = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = await hmacSha256(merchant_key, hashStr + merchant_salt);

    // Prepare form data for PayTR API
    const formData = new URLSearchParams();
    formData.append('merchant_id', merchant_id);
    formData.append('user_ip', user_ip);
    formData.append('merchant_oid', merchant_oid);
    formData.append('email', email);
    formData.append('payment_amount', payment_amount.toString());
    formData.append('paytr_token', paytr_token);
    formData.append('user_basket', user_basket);
    formData.append('debug_on', debug_on);
    formData.append('no_installment', no_installment);
    formData.append('max_installment', max_installment);
    formData.append('user_name', user_name);
    formData.append('user_address', user_address);
    formData.append('user_phone', user_phone);
    formData.append('merchant_ok_url', merchant_ok_url);
    formData.append('merchant_fail_url', merchant_fail_url);
    formData.append('timeout_limit', timeout_limit);
    formData.append('currency', currency);
    formData.append('test_mode', test_mode);
    formData.append('lang', 'tr');

    // POST to PayTR API to get iframe token
    const paytrRes = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const paytrData = await paytrRes.json();

    if (paytrData.status !== 'success') {
      console.error('PayTR token error:', paytrData.reason);
      return new Response(JSON.stringify({
        error: 'Odeme tokeni olusturulamadi.',
        detail: paytrData.reason
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store order info in database for callback verification
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Store pending order - use user_subscriptions or a simple approach
    // We'll store merchant_oid in localStorage on frontend and verify on callback

    return new Response(JSON.stringify({
      status: 'success',
      token: paytrData.token,
      merchant_oid: merchant_oid,
      plan_type: plan_type,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Bir hata olustu. Lutfen tekrar deneyin.' }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
