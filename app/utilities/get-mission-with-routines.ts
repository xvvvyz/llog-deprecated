import createServerSupabaseClient from './create-server-supabase-client';

const getMissionWithRoutines = (missionId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select(
      `
        id,
        name,
        routines:event_types(
          content,
          id,
          inputs:event_type_inputs(
            input:inputs(id, label)
          ),
          name,
          order,
          session,
          type
        )`
    )
    .eq('id', missionId)
    .not('routines.session', 'is', null)
    .eq('routines.deleted', false)
    .order('order', { foreignTable: 'event_types' })
    .order('order', { foreignTable: 'event_types.event_type_inputs' })
    .single();

export type GetMissionWithEventTypesData = Awaited<
  ReturnType<typeof getMissionWithRoutines>
>['data'];

export default getMissionWithRoutines;
