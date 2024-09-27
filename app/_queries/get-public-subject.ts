import getSubject from '@/_queries/get-subject';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicSubject = async (subjectId: string) =>
  (await createServerSupabaseClient()).rpc('get_public_subject', {
    public_subject_id: subjectId,
  }) as unknown as ReturnType<typeof getSubject>;

export default getPublicSubject;
