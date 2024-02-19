'use server';

import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const updateAccount = async (
  context: {
    avatar?: File | string | null;
    deleteAvatar?: boolean;
    next: string;
  },
  _state: { error: string } | null,
  data: FormData,
) => {
  const supabase = createServerSupabaseClient();
  const email = data.get('email');

  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: data.get('first-name') || undefined,
      last_name: data.get('last-name') || undefined,
    },
    email: (email as string) || undefined,
    password: (data.get('password') as string) || undefined,
  });

  if (error) return { error: error.message };
  const avatar = data.get('avatar') as File | undefined;
  const user = await getCurrentUserFromSession();

  if (context.deleteAvatar) {
    await Promise.all([
      supabase.storage.from('profiles').remove([`${user?.id}/avatar`]),
      supabase.auth.updateUser({ data: { image_uri: null } }),
    ]);
  } else if (avatar?.size && avatar.type.startsWith('image/')) {
    await supabase.storage
      .from('profiles')
      .upload(`${user?.id}/avatar`, avatar, { upsert: true });
  }

  if (email && email !== user?.email) {
    redirect('/confirmation-sent');
  }

  await supabase.auth.refreshSession();
  revalidatePath('/', 'layout');
  redirect(context.next);
};

export default updateAccount;
