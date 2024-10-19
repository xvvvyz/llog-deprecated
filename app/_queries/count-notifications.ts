import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const countNotifications = async () =>
  (await createServerSupabaseClient())
    .from('notifications')
    .select('*', { count: 'estimated', head: true })
    .eq('profile_id', (await getCurrentUser())?.id ?? '');

export default countNotifications;
