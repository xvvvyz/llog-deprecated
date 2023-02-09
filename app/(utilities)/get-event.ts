import { Database } from '(types)/database';
import createServerSupabaseClient from './create-server-supabase-client';

const getEvent = (eventId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      `
      id,
      inputs:event_inputs(id, input_id, input_option_id, value),
      type:event_types(
        content,
        id,
        inputs:event_type_inputs(
          input:inputs(
            id,
            label,
            options:input_options(id, label),
            type
          )
        ),
        mission:missions(id, name),
        name,
        order,
        session,
        type
      )`
    )
    .eq('id', eventId)
    .order('order', { foreignTable: 'type.inputs' })
    .order('order', { foreignTable: 'type.inputs.input.options' })
    .single();

export type GetEventData = Awaited<ReturnType<typeof getEvent>>['data'] & {
  type: Pick<
    Database['public']['Tables']['event_types']['Row'],
    'content' | 'id' | 'name' | 'order' | 'session' | 'type'
  > & {
    inputs: Array<
      Pick<
        Database['public']['Tables']['inputs']['Row'],
        'id' | 'label' | 'type'
      > & {
        options: Array<
          Pick<
            Database['public']['Tables']['input_options']['Row'],
            'id' | 'label'
          >
        >;
      }
    >;
    mission: Pick<
      Database['public']['Tables']['missions']['Row'],
      'id' | 'name'
    >;
  };
};

export default getEvent;
