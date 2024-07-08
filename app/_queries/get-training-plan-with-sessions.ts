import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTrainingPlanWithSessions = (
  trainingPlanId: string,
  { draft } = { draft: false },
) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name, sessions(draft, id, order, scheduled_for, title)')
    .eq('id', trainingPlanId)
    .order('order', { referencedTable: 'sessions' })
    .not('sessions.draft', 'is', draft ? null : true)
    .order('draft', { ascending: false, referencedTable: 'sessions' })
    .single();

export type GetTrainingPlanWithSessionsData = Awaited<
  ReturnType<typeof getTrainingPlanWithSessions>
>['data'];

export default getTrainingPlanWithSessions;
