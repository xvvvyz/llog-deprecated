import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getMissionWithSessionsAndEvents = (
  missionId: string,
  includeDraft = false,
) =>
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
    .order('order', { foreignTable: 'sessions' })
    .not('sessions.draft', 'is', includeDraft ? null : true)
    .order('draft', { ascending: false, foreignTable: 'sessions' })
    .eq('sessions.modules.archived', false)
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
