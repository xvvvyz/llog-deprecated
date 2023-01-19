import createServerSupabaseClient from 'utilities/create-server-supabase-client';

const getSessionRoutines = (
  missionId: string,
  sessionNumber: number | string
) =>
  createServerSupabaseClient()
    .from('event_types')
    .select('content, id, name, event:events(id)')
    .eq('mission_id', missionId)
    .eq('session', Number(sessionNumber) - 1)
    .order('order');

export type GetSessionEventTypesData = Awaited<
  ReturnType<typeof getSessionRoutines>
>['data'];

export default getSessionRoutines;
