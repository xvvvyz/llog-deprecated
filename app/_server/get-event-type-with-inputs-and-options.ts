import createServerComponentClient from './create-server-component-client';

const getEventTypeWithInputsAndOptions = (eventTypeId: string) =>
  createServerComponentClient()
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
          settings,
          type
        )
      ),
      name,
      order,
      type`
    )
    .eq('id', eventTypeId)
    .order('order', { foreignTable: 'inputs' })
    .eq('inputs.input.options.deleted', false)
    .order('order', { foreignTable: 'inputs.input.options' })
    .single();

export type GetEventTypeWithInputsAndOptionsData = Awaited<
  ReturnType<typeof getEventTypeWithInputsAndOptions>
>['data'];

export default getEventTypeWithInputsAndOptions;
