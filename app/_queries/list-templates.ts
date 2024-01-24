import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplates = async () =>
  createServerSupabaseClient()
    .from('templates')
    .select('id, name')
    .eq('team_id', (await getCurrentUserFromSession())?.id ?? '')
    .order('name');

export type ListTemplatesData = Awaited<
  ReturnType<typeof listTemplates>
>['data'];

export default listTemplates;
