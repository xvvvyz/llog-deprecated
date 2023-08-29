import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getSessionWithDetails = (sessionId: string) =>
  createServerComponentClient()
    .from('sessions')
    .select(
      `
      id,
      order,
      modules:event_types(
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
          inputs:event_inputs(id, input_id, input_option_id, value),
          profile:profiles(first_name, id, last_name)
        ),
        id,
        inputs:event_type_inputs(
          input:inputs(
            id,
            label,
            options:input_options(id, label),
            settings,
            type
          )
        ),
        name,
        order
      ),
      scheduled_for,
      title`,
    )
    .eq('id', sessionId)
    .eq('modules.archived', false)
    .order('order', { foreignTable: 'modules' })
    .order('order', { foreignTable: 'modules.event.inputs' })
    .order('order', { foreignTable: 'modules.inputs' })
    .order('order', { foreignTable: 'modules.inputs.input.options' })
    .single();

export type GetSessionWithDetailsData = Awaited<
  ReturnType<typeof getSessionWithDetails>
>['data'] & {
  modules: Array<
    Pick<
      Database['public']['Tables']['event_types']['Row'],
      'content' | 'id' | 'name' | 'order'
    > & {
      event: Array<
        Pick<
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
              'id' | 'input_id' | 'input_option_id' | 'value'
            >
          >;
          profile: Pick<
            Database['public']['Tables']['profiles']['Row'],
            'first_name' | 'id' | 'last_name'
          >;
        }
      >;
      inputs: Array<
        Pick<
          Database['public']['Tables']['event_type_inputs']['Row'],
          'input_id'
        > & {
          input: Pick<
            Database['public']['Tables']['inputs']['Row'],
            'id' | 'label' | 'settings' | 'type'
          > & {
            options: Array<
              Pick<
                Database['public']['Tables']['input_options']['Row'],
                'id' | 'label'
              >
            >;
          };
        }
      >;
    }
  >;
};

export default getSessionWithDetails;
