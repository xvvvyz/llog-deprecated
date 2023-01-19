import createServerSupabaseClient from './create-server-supabase-client';

const getEventType = (eventTypeId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select(
      'id, name, inputs:event_type_inputs(order, input:inputs(id, label, type, options:input_options(id, label)))'
    )
    .eq('id', eventTypeId)
    .order('order', { foreignTable: 'event_type_inputs' })
    .single();

export type GetEventTypeData = Awaited<ReturnType<typeof getEventType>>['data'];

export default getEventType;
