'use server';

import * as ls from '@lemonsqueezy/lemonsqueezy.js';

const getSubscriptionBillingPortal = async (id: number) => {
  ls.lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! });
  const res = await ls.getSubscription(id);
  return { url: res.data?.data?.attributes?.urls?.customer_portal };
};

export default getSubscriptionBillingPortal;
