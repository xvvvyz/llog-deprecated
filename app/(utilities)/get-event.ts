import { Database } from '(types)/database';
import { InputType } from '(types)/input';
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
            settings,
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
    .eq('type.inputs.input.options.deleted', false)
    .order('order', { foreignTable: 'type.inputs.input.options' })
    .single();

export type GetEventData = Awaited<ReturnType<typeof getEvent>>['data'] & {
  inputs: Array<
    Pick<
      Database['public']['Tables']['event_inputs']['Row'],
      'id' | 'input_id' | 'input_option_id' | 'value'
    >
  >;
  type: Pick<
    Database['public']['Tables']['event_types']['Row'],
    'content' | 'id' | 'name' | 'order' | 'session' | 'type'
  > & {
    inputs: Array<
      Pick<InputType, 'id' | 'label' | 'settings' | 'type'> & {
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
