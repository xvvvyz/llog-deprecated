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
          event:events(
            comments(
              content,
              created_at,
              id,
              profile:profiles(first_name, id, last_name)
            ),
            created_at,
            id,
            inputs:event_inputs(
              input:inputs(id, label, type),
              option:input_options(id, label),
              value
            ),
            profile:profiles(first_name, id, last_name)
          ),
          id,
          inputs:event_type_inputs(input_id),
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
