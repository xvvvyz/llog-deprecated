import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTrainingPlanWithSessionsAndEvents = (
  trainingPlanId: string,
  { draft } = { draft: false },
) =>
  createServerSupabaseClient()
    .from('missions')
    .select(
      `
      id,
      name,
      sessions(
        draft,
        id,
        modules:event_types(
          event:events(id),
          id
        ),
        order,
        scheduled_for,
        title
      )`,
    )
    .eq('id', trainingPlanId)
    .order('order', { referencedTable: 'sessions' })
    .not('sessions.draft', 'is', draft ? null : true)
    .order('draft', { ascending: false, referencedTable: 'sessions' })
    .eq('sessions.modules.archived', false)
    .single();

export type GetTrainingPlanWithSessionsAndEventsData = Awaited<
  ReturnType<typeof getTrainingPlanWithSessionsAndEvents>
>['data'];

export default getTrainingPlanWithSessionsAndEvents;
