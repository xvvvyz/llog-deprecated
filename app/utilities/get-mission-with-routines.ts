import createServerSupabaseClient from './create-server-supabase-client';

const getMissionWithRoutines = (missionId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select(
      'id, name, routines:event_types(content, id, name, order, session, inputs(id, label))'
    )
    .eq('id', missionId)
    .order('order', { foreignTable: 'event_types' })
    .single();

export type GetMissionWithEventTypesData = Awaited<
  ReturnType<typeof getMissionWithRoutines>
>['data'];

export default getMissionWithRoutines;
