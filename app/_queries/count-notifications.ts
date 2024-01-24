import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const countNotifications = async () =>
  createServerSupabaseClient()
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('archived', false);

export default countNotifications;
