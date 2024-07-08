import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjects = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('archived, id, image_uri, name, public, share_code, team_id')
    .not('team_id', 'is', null)
    .eq('deleted', false)
    .not('archived', 'is', null)
    .order('name');

export type ListSubjectsData = Awaited<ReturnType<typeof listSubjects>>['data'];

export default listSubjects;
