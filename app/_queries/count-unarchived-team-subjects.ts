import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const countUnarchivedTeamSubjects = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('*', { count: 'exact', head: true })
    .eq('archived', false)
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('deleted', false)
    .eq('archived', false);

export default countUnarchivedTeamSubjects;
