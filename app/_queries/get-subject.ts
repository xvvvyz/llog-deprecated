import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getSubject = async (subjectId: string) =>
  (await createServerSupabaseClient())
    .from('subjects')
    .select('archived, data, id, image_uri, name, public, share_code, team_id')
    .eq('id', subjectId)
    .eq('deleted', false)
    .single();

export type GetSubjectData = Awaited<ReturnType<typeof getSubject>>['data'];

export default getSubject;
