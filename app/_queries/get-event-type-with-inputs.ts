import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getEventTypeWithInputsAndOptions = (eventTypeId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select(
      `
      content,
      id,
      inputs:event_type_inputs(input_id),
      name`,
    )
    .eq('id', eventTypeId)
    .order('order', { referencedTable: 'event_type_inputs' })
    .single();

export type GetEventTypeWithInputsData = Awaited<
  ReturnType<typeof getEventTypeWithInputsAndOptions>
>['data'];

export default getEventTypeWithInputsAndOptions;
