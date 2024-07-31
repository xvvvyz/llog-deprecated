'use server';

import getCustomer from '@/_queries/get-customer';

import {
  getCustomer as lemonSqueezyGetCustomer,
  lemonSqueezySetup,
} from '@lemonsqueezy/lemonsqueezy.js';

const getCustomerBillingPortal = async () => {
  const { data: customer } = await getCustomer();
  if (!customer) return { url: null };
  lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! });
  const res = await lemonSqueezyGetCustomer(customer.customer_id);
  return { url: res.data?.data.attributes.urls.customer_portal ?? null };
};

export default getCustomerBillingPortal;
