import { Database } from '@/_types/database';
import createServerComponentClient from './create-server-component-client';

const getMissionWithRoutines = (missionId: string) =>
  createServerComponentClient()
    .from('missions')
    .select(
      `
      id,
      name,
      sessions(
        id,
        order,
        routines:event_types(
          content,
          event:events(id),
          id,
          inputs:event_type_inputs(input_id),
          name,
          order,
          type
        ),
        scheduled_for
      )`
    )
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .eq('sessions.routines.deleted', false)
    .order('order', { foreignTable: 'sessions' })
    .order('order', { foreignTable: 'sessions.routines' })
    .order('order', { foreignTable: 'sessions.routines.inputs' })
    .single();

export type GetMissionWithEventTypesData = Awaited<
  ReturnType<typeof getMissionWithRoutines>
>['data'] & {
  sessions: Array<
    Pick<
      Database['public']['Tables']['sessions']['Row'],
      'id' | 'order' | 'scheduled_for'
    > & {
      routines: Array<
        Pick<
          Database['public']['Tables']['event_types']['Row'],
          'content' | 'id' | 'name' | 'order' | 'type'
        > & {
          event: Pick<Database['public']['Tables']['events']['Row'], 'id'>;
          inputs: Array<
            Pick<
              Database['public']['Tables']['event_type_inputs']['Row'],
              'input_id'
            >
          >;
        }
      >;
    }
  >;
};

export default getMissionWithRoutines;
