'use server';

import getCurrentUser from '@/_queries/get-current-user';

import {
  getCustomer as lemonSqueezyGetCustomer,
  lemonSqueezySetup,
} from '@lemonsqueezy/lemonsqueezy.js';

const getCustomerBillingPortal = async () => {
  const user = await getCurrentUser();
  if (!user) return { url: null };
  lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! });
  const res = await lemonSqueezyGetCustomer(user.app_metadata.customer_id);
  return { url: res.data?.data?.attributes?.urls?.customer_portal ?? null };
};

export default getCustomerBillingPortal;
