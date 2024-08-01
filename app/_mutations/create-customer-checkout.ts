'use server';

import getCurrentUser from '@/_queries/get-current-user';
import * as ls from '@lemonsqueezy/lemonsqueezy.js';

const createCustomerCheckout = async () => {
  const user = await getCurrentUser();
  if (!user) return { url: null };
  ls.lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! });

  const res = await ls.createCheckout(
    process.env.LEMON_SQUEEZY_STORE_ID!,
    process.env.LEMON_SQUEEZY_VARIANT_ID!,
    {
      checkoutData: {
        custom: { user_id: user.id },
        email: user.email,
        name: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
      },
    },
  );

  return { url: res.data?.data?.attributes?.url ?? null };
};

export default createCustomerCheckout;
