// PayTR Callback Edge Function
// PayTR sends POST request to this endpoint after payment is processed
// This function verifies the payment and activates the subscription

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as base64Encode } from 'https://deno.land/std@0.208.0/encoding/base64.ts'

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

Deno.serve(async (req) => {
  // PayTR callback is always POST
  if (req.method !== 'POST') {
    return new Response('OK', { status: 200 });
  }

  try {
    const merchant_key = Deno.env.get('PAYTR_MERCHANT_KEY');
    const merchant_salt = Deno.env.get('PAYTR_MERCHANT_SALT');

    if (!merchant_key || !merchant_salt) {
      console.error('PayTR credentials not configured for callback');
      return new Response('OK', { status: 200 });
    }

    // Parse form data from PayTR
    const formData = await req.formData();
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    const failed_reason_code = formData.get('failed_reason_code') as string;
    const failed_reason_msg = formData.get('failed_reason_msg') as string;
    const test_mode = formData.get('test_mode') as string;
    const payment_type = formData.get('payment_type') as string;

    console.log('PayTR Callback received:', {
      merchant_oid,
      status,
      total_amount,
      test_mode,
      payment_type,
      failed_reason_code,
      failed_reason_msg
    });

    // Verify hash - PayTR hash verification
    // hash = base64(hmac_sha256(merchant_key, merchant_oid + merchant_salt + status + total_amount))
    const hashStr = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const expectedHash = await hmacSha256(merchant_key, hashStr);

    if (hash !== expectedHash) {
      console.error('PayTR hash verification failed!', { received: hash, expected: expectedHash });
      return new Response('OK', { status: 200 });
    }

    console.log('PayTR hash verified successfully');

    // Extract user_id from merchant_oid: LGS{userId32chars}T{timestamp} format
    // LGS = 3 chars, userId (no dashes) = 32 chars, T = separator, rest = timestamp
    if (!merchant_oid.startsWith('LGS') || !merchant_oid.includes('T')) {
      console.error('Invalid merchant_oid format:', merchant_oid);
      return new Response('OK', { status: 200 });
    }

    const tIndex = merchant_oid.indexOf('T', 3);
    const userIdNoDashes = merchant_oid.substring(3, tIndex);

    // Reconstruct UUID: 8-4-4-4-12
    const userId = `${userIdNoDashes.slice(0,8)}-${userIdNoDashes.slice(8,12)}-${userIdNoDashes.slice(12,16)}-${userIdNoDashes.slice(16,20)}-${userIdNoDashes.slice(20)}`;

    console.log('Extracted userId:', userId);

    // Determine plan type from total_amount (kuruş)
    const amount = parseInt(total_amount);
    let plan_type: 'plus' | 'premium';
    if (amount === 4500) {
      plan_type = 'plus';
    } else if (amount === 45000) {
      plan_type = 'premium';
    } else {
      console.error('Unknown payment amount:', amount);
      return new Response('OK', { status: 200 });
    }

    // Connect to Supabase with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (status === 'success') {
      // Use exact user_id match
      const user_id = userId;

      // Calculate expiry
      const now = new Date();
      const expiresAt = new Date(now);
      if (plan_type === 'plus') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const features = {
        unlimited_hearts: true,
        ad_free: true,
        ai_coach: true,
        special_badges: true,
      };

      // Update subscription
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          plan_type: plan_type,
          is_active: true,
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          cancelled_at: null,
          features: features,
        })
        .eq('user_id', user_id);

      if (updateError) {
        console.error('Failed to update subscription:', updateError);
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user_id,
            plan_type: plan_type,
            is_active: true,
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            cancelled_at: null,
            features: features,
          });

        if (insertError) {
          console.error('Failed to insert subscription:', insertError);
        }
      }

      console.log(`Subscription activated for user ${user_id}: ${plan_type}`);
    } else {
      console.log(`Payment failed for ${merchant_oid}: ${failed_reason_msg} (code: ${failed_reason_code})`);
    }

    // PayTR expects "OK" response
    return new Response('OK', { status: 200 });

  } catch (error: unknown) {
    console.error('PayTR callback error:', error);
    return new Response('OK', { status: 200 });
  }
});
