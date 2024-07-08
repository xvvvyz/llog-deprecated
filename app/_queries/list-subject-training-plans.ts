import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectTrainingPlans = (subjectId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select(
      'id, name, sessions(id, modules:event_types(event:events(id)), order)',
    )
    .eq('subject_id', subjectId)
    .eq('archived', false)
    .order('name')
    .order('order', { referencedTable: 'sessions' })
    .eq('sessions.draft', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      referencedTable: 'sessions',
    })
    .eq('sessions.modules.archived', false);

export type ListSubjectTrainingPlansData = Awaited<
  ReturnType<typeof listSubjectTrainingPlans>
>['data'];

export default listSubjectTrainingPlans;
