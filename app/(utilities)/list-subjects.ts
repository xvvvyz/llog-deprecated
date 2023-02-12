import createServerSupabaseClient from './create-server-supabase-client';

const listSubjects = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('id, image_uri, name')
    .not('team_id', 'is', null)
    .eq('deleted', false)
    .order('updated_at', { ascending: false });

export type ListSubjectsData = Awaited<ReturnType<typeof listSubjects>>['data'];
export default listSubjects;
