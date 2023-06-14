import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getMissionWithEventTypes = (missionId: string) =>
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
  ReturnType<typeof getMissionWithEventTypes>
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
          event: Pick<
            Database['public']['Tables']['events']['Row'],
            'created_at' | 'id'
          > & {
            comments: Array<
              Pick<
                Database['public']['Tables']['comments']['Row'],
                'content' | 'created_at' | 'id'
              > & {
                profile: Pick<
                  Database['public']['Tables']['profiles']['Row'],
                  'first_name' | 'id' | 'last_name'
                >;
              }
            >;
            inputs: Array<
              Pick<
                Database['public']['Tables']['event_inputs']['Row'],
                'value'
              > & {
                input: Pick<
                  Database['public']['Tables']['inputs']['Row'],
                  'id' | 'label' | 'type'
                >;
                option: Pick<
                  Database['public']['Tables']['input_options']['Row'],
                  'id' | 'label'
                >;
              }
            >;
            profile: Pick<
              Database['public']['Tables']['profiles']['Row'],
              'first_name' | 'id' | 'last_name'
            >;
          };
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

export default getMissionWithEventTypes;
