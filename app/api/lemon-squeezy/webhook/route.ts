import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import crypto from 'crypto';

const POST = async (request: Request) => {
  const body = await request.text();
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8');
  const rawSignature = request.headers.get('X-Signature') ?? '';
  const signature = Buffer.from(rawSignature, 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return new Response('Invalid signature', { status: 400 });
  }

  let customerId, eventName, subscriptionStatus, userId;

  try {
    const json = JSON.parse(body);
    customerId = json.data.attributes.customer_id;
    eventName = json.meta.event_name;
    subscriptionStatus = json.data.attributes.status;
    userId = json.meta.custom_data.user_id;
  } catch (e) {
    return new Response('Invalid payload', { status: 400 });
  }

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_expired': {
      await createServerSupabaseClient({
        apiKey: process.env.SUPABASE_SERVICE_KEY!,
      }).auth.admin.updateUserById(userId, {
        app_metadata: {
          customer_id: customerId,
          subscription_status: subscriptionStatus,
        },
      });

      return new Response('OK', { status: 200 });
    }

    default: {
      return new Response('Invalid payload', { status: 400 });
    }
  }
};

export { POST };
