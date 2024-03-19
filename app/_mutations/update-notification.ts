'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const updateNotification = async (notification: {
  archived: boolean;
  id: string;
}) => {
  await createServerSupabaseClient()
    .from('notifications')
    .update(notification)
    .eq('id', notification.id);

  revalidatePath('/', 'layout');
};

export default updateNotification;
