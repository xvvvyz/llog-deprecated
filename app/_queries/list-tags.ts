import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTags = async () =>
  (await createServerSupabaseClient())
    .from('tags')
    .select('id, name')
    .eq('team_id', (await getCurrentUser())?.app_metadata?.active_team_id ?? '')
    .order('name');

export type ListTagsData = Awaited<ReturnType<typeof listTags>>['data'];

export default listTags;
