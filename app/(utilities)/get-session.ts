import { Database } from '(types)/database';
import createServerSupabaseClient from '(utilities)/create-server-supabase-client';

const getSession = (sessionId: string) =>
  createServerSupabaseClient()
    .from('sessions')
    .select(
      `
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
        order,
        type
      ),
      scheduled_for`
    )
    .eq('id', sessionId)
    .eq('routines.deleted', false)
    .eq('routines.inputs.input.options.deleted', false)
    .order('order', { foreignTable: 'routines' })
    .order('order', { foreignTable: 'routines.event.inputs' })
    .order('order', { foreignTable: 'routines.inputs' })
    .order('order', { foreignTable: 'routines.inputs.input.options' })
    .single();

export type GetSessionData = Awaited<ReturnType<typeof getSession>>['data'] & {
  routines: Array<
    Pick<
      Database['public']['Tables']['event_types']['Row'],
      'content' | 'id' | 'name' | 'order' | 'type'
    > & {
      event: Array<
        Pick<
          Database['public']['Tables']['events']['Row'],
          'created_at' | 'id'
        > & {
          comments: Array<
            Pick<
              Database['public']['Tables']['comments']['Row'],
              'content' | 'id'
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

export default getSession;
