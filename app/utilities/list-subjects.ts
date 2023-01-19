import createServerSupabaseClient from './create-server-supabase-client';
import getCurrentTeamId from './get-current-team-id';

const listSubjects = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('id, image_uri, name')
    .eq('team_id', await getCurrentTeamId())
    .order('updated_at', { ascending: false });

export type ListSubjectsData = Awaited<ReturnType<typeof listSubjects>>['data'];
export default listSubjects;
