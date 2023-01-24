import createServerSupabaseClient from './create-server-supabase-client';

const getEventType = (eventTypeId: string) =>
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
      type`
    )
    .eq('id', eventTypeId)
    .order('order', { foreignTable: 'event_type_inputs' })
    .single();

export type GetEventTypeData = Awaited<ReturnType<typeof getEventType>>['data'];

export default getEventType;
