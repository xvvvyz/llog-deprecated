import SUBSCRIPTION_VARIANT_ID_NAMES from '@/_constants/constant-subscription-variant-id-names';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import crypto from 'crypto';

const POST = async (request: Request) => {
  const body = await request.text();
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8');
  const rawSignature = request.headers.get('X-Signature') ?? '';
  const signature = Buffer.from(rawSignature, 'utf8');
  const digestUint8 = new Uint8Array(digest);
  const signatureUint8 = new Uint8Array(signature);

  if (!crypto.timingSafeEqual(digestUint8, signatureUint8)) {
    return new Response('Invalid signature', { status: 400 });
  }

  let customerId,
    eventName,
    subscriptionId,
    subscriptionStatus,
    teamId,
    userId,
    variantId;

  try {
    const json = JSON.parse(body);
    customerId = json.data.attributes.customer_id;
    eventName = json.meta.event_name;
    subscriptionId = json.data.id;
    subscriptionStatus = json.data.attributes.status;
    teamId = json.meta.custom_data.team_id;
    userId = json.meta.custom_data.user_id;
    variantId = json.data.attributes.variant_id;
  } catch {
    return new Response('Invalid payload', { status: 400 });
  }

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated': {
      const supabase = await createServerSupabaseClient({
        apiKey: process.env.SUPABASE_SERVICE_KEY!,
      });

      await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { customer_id: customerId },
      });

      await supabase.from('subscriptions').upsert({
        id: subscriptionId,
        profile_id: userId,
        status: subscriptionStatus,

        // default to user_id because kelsie doesn't have team_id in her sub
        team_id: teamId ?? userId,

        variant: SUBSCRIPTION_VARIANT_ID_NAMES[variantId],
      });

      return new Response('OK', { status: 200 });
    }

    default: {
      return new Response('Invalid payload', { status: 400 });
    }
  }
};

export { POST };
