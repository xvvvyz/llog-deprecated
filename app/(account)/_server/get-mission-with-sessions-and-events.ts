import createServerComponentClient from '@/_server/create-server-component-client';

const getMissionWithSessionsAndEvents = (missionId: string) =>
  createServerComponentClient()
    .from('missions')
    .select(
      `
      id,
      name,
      sessions(
        id,
        modules:event_types(
          events(id),
          id
        ),
        order,
        scheduled_for,
        title
      )`
    )
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .order('order', { foreignTable: 'sessions' })
    .single();

export type GetMissionWithSessionsAndEventsData = Awaited<
  ReturnType<typeof getMissionWithSessionsAndEvents>
>['data'];

export default getMissionWithSessionsAndEvents;
