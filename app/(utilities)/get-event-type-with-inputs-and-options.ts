import createServerSupabaseClient from './create-server-supabase-client';

const getEventTypeWithInputsAndOptions = (eventTypeId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select(
      `
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
      name,
      order,
      type`
    )
    .eq('id', eventTypeId)
    .order('order', { foreignTable: 'event_type_inputs' })
    .single();

export type GetEventTypeWithInputsAndOptionsData = Awaited<
  ReturnType<typeof getEventTypeWithInputsAndOptions>
>['data'];

export default getEventTypeWithInputsAndOptions;
