'use server';

import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import * as ls from '@lemonsqueezy/lemonsqueezy.js';
import { revalidatePath } from 'next/cache';

const updateUser = async ({
  email,
  firstName,
  lastName,
}: {
  email?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  const firstNameTrimmed = firstName?.trim();
  const lastNameTrimmed = lastName?.trim();

  const { error } = await supabase.auth.updateUser({
    data: { first_name: firstNameTrimmed, last_name: lastNameTrimmed },
    email,
  });

  if (error) return { error: error.message };

  if (user?.app_metadata.customer_id) {
    ls.lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! });

    await ls.updateCustomer(user.app_metadata.customer_id, {
      email,
      name:
        firstNameTrimmed && lastNameTrimmed
          ? `${firstNameTrimmed} ${lastNameTrimmed}`
          : undefined,
    });
  }

  await supabase.auth.refreshSession();
  revalidatePath('/', 'layout');
};

export default updateUser;
