import createServerSupabaseClient from './create-server-supabase-client';
import getCurrentTeamId from './get-current-team-id';

const listTemplates = async () =>
  createServerSupabaseClient()
    .from('templates')
    .select('data, id, name, public, type')
    .match({ team_id: await getCurrentTeamId(), type: ['event'] })
    .order('updated_at', { ascending: false });

export type ListTemplatesData = Awaited<
  ReturnType<typeof listTemplates>
>['data'];

export default listTemplates;
