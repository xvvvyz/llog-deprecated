import { Database } from '(types)/database';
import { InputType } from '(types)/input';
import createServerSupabaseClient from '(utilities)/create-server-supabase-client';

const listSessionRoutines = (
  missionId: string,
  sessionNumber: number | string
) =>
  createServerSupabaseClient()
    .from('event_types')
    .select(
      `
      content,
      event:events(
        comments(
          content,
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
      session,
      type`
    )
    .eq('mission_id', missionId)
    .eq('session', Number(sessionNumber) - 1)
    .eq('deleted', false)
    .order('order')
    .order('order', { foreignTable: 'inputs' })
    .eq('inputs.input.options.deleted', false)
    .order('order', { foreignTable: 'inputs.input.options' });

export type ListSessionRoutinesData = Awaited<
  ReturnType<typeof listSessionRoutines>
>['data'] & {
  event: Pick<
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
  };
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
};

export default listSessionRoutines;
