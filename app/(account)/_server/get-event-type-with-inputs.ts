import createServerComponentClient from '@/_server/create-server-component-client';

const getEventTypeWithInputsAndOptions = (eventTypeId: string) =>
  createServerComponentClient()
    .from('event_types')
    .select(
      `
      content,
      id,
      inputs:event_type_inputs(
        input:inputs(id, label, subjects(id, image_uri, name))
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
