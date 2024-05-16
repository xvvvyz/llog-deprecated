import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplatesWithData = async () =>
  createServerSupabaseClient()
    .from('templates')
    .select('data, id, name')
    .match({ team_id: (await getCurrentUser())?.id })
    .order('name');

export type ListTemplatesWithDataData = Awaited<
  ReturnType<typeof listTemplatesWithData>
>['data'];

export default listTemplatesWithData;
