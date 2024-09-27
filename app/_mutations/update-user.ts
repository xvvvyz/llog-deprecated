'use server';

import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import * as ls from '@lemonsqueezy/lemonsqueezy.js';
import { revalidatePath } from 'next/cache';

const updateUser = async ({
  email,
  first_name,
  last_name,
}: {
  email?: string;
  first_name?: string;
  last_name?: string;
}) => {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    data: { first_name, last_name },
    email,
  });

  if (error) return { error: error.message };

  if (user?.app_metadata.customer_id) {
    ls.lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! });

    await ls.updateCustomer(user.app_metadata.customer_id, {
      email,
      name: first_name && last_name ? `${first_name} ${last_name}` : undefined,
    });
  }

  await supabase.auth.refreshSession();
  revalidatePath('/', 'layout');
};

export default updateUser;
