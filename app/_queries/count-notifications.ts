import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const countNotifications = async () =>
  (await createServerSupabaseClient())
    .from('notifications')
    .select('*', { count: 'estimated', head: true });

export default countNotifications;
