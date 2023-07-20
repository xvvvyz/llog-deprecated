import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getMissionWithSessionsAndEvents = (missionId: string) =>
  createServerComponentClient()
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
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .order('order', { ascending: false, foreignTable: 'sessions' })
    .order('draft', { foreignTable: 'sessions' })
    .eq('sessions.modules.deleted', false)
    .single();

export type GetMissionWithSessionsAndEventsData = Awaited<
  ReturnType<typeof getMissionWithSessionsAndEvents>
>['data'] & {
  sessions: Array<
    Pick<
      Database['public']['Tables']['sessions']['Row'],
      'draft' | 'id' | 'order' | 'scheduled_for' | 'title'
    >
  >;
};

export default getMissionWithSessionsAndEvents;
