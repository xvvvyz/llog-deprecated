import createServerSupabaseClient from './create-server-supabase-client';

const getLastMissionEventType = (missionId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select('session')
    .eq('mission_id', missionId)
    .order('order', { ascending: false })
    .limit(1);

export type GetLastMissionEventTypeData = Awaited<
  ReturnType<typeof getLastMissionEventType>
>['data'];

export default getLastMissionEventType;
