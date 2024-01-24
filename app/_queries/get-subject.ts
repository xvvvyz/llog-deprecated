import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getSubject = (subjectId: string) =>
  createServerSupabaseClient()
    .from('subjects')
    .select('banner, id, image_uri, name, public, share_code, team_id')
    .eq('id', subjectId)
    .single();

export type GetSubjectData = Awaited<ReturnType<typeof getSubject>>['data'];

export default getSubject;
