import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const canInsertSubjectOnCurrentPlan = async (subjectId?: string) =>
  (await createServerSupabaseClient()).rpc(
    'can_insert_subject_on_current_plan',
    { subject_id: subjectId },
  ) as unknown as { data: boolean };

export default canInsertSubjectOnCurrentPlan;
