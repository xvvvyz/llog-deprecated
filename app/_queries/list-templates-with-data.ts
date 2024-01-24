import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplatesWithData = async () =>
  createServerSupabaseClient()
    .from('templates')
    .select('data, id, name')
    .match({ team_id: (await getCurrentUserFromSession())?.id })
    .order('name');

export type ListTemplatesWithDataData = Awaited<
  ReturnType<typeof listTemplatesWithData>
>['data'];

export default listTemplatesWithData;
