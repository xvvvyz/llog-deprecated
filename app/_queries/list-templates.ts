import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplates = async () =>
  createServerSupabaseClient()
    .from('templates')
    .select('id, name')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .order('name');

export type ListTemplatesData = Awaited<
  ReturnType<typeof listTemplates>
>['data'];

export default listTemplates;
