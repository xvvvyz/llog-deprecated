import createServerSupabaseClient from './create-server-supabase-client';

const getEventTypeWithInputsAndOptions = (eventTypeId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select(
      `
      content,
      id,
      inputs:event_type_inputs(
        input:inputs(id, label)
      ),
      name,
      order,
      type`
    )
    .eq('id', eventTypeId)
    .order('order', { foreignTable: 'event_type_inputs' })
    .single();

export type GetEventTypeWithInputsData = Awaited<
  ReturnType<typeof getEventTypeWithInputsAndOptions>
>['data'];

export default getEventTypeWithInputsAndOptions;
