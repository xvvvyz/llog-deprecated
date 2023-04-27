import { Database } from '(types)/database';
import { InputType } from '(types)/input';
import createServerSupabaseClient from './create-server-supabase-client';

const getEvent = (eventId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      `
      comments(
        content,
        created_at,
        id,
        profile:profiles(first_name, id, last_name)
      ),
      created_at,
      id,
      inputs:event_inputs(id, input_id, input_option_id, value),
      profile:profiles(first_name, id, last_name),
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
        name,
        order,
        type
      )`
    )
    .eq('id', eventId)
    .eq('type.inputs.input.options.deleted', false)
    .order('created_at', { foreignTable: 'comments' })
    .order('order', { foreignTable: 'inputs' })
    .order('order', { foreignTable: 'type.inputs' })
    .order('order', { foreignTable: 'type.inputs.input.options' })
    .single();

export type GetEventData = Awaited<ReturnType<typeof getEvent>>['data'] & {
  comments: Array<
    Pick<Database['public']['Tables']['comments']['Row'], 'content' | 'id'> & {
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
  type: Pick<
    Database['public']['Tables']['event_types']['Row'],
    'content' | 'id' | 'name' | 'order' | 'type'
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
