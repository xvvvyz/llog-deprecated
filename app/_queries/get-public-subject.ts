import getSubject from '@/_queries/get-subject';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicSubject = (subjectId: string) =>
  createServerSupabaseClient().rpc('get_public_subject', {
    public_subject_id: subjectId,
  }) as ReturnType<typeof getSubject>;

export default getPublicSubject;
