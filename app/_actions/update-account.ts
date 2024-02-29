'use server';

import { AccountEmailFormValues } from '@/_components/account-email-form';
import { AccountPasswordFormValues } from '@/_components/account-password-form';
import { AccountProfileFormValues } from '@/_components/account-profile-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const updateAccount = async (
  data: Partial<
    Omit<AccountProfileFormValues, 'avatar'> &
      AccountPasswordFormValues &
      AccountEmailFormValues
  >,
) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: data.firstName || undefined,
      last_name: data.lastName || undefined,
    },
    email: data.email || undefined,
    password: data.password || undefined,
  });

  if (error) return { error: error.message };
  await supabase.auth.refreshSession();
};

export default updateAccount;
