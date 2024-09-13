import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getEvent = (eventId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      `
      comments(
        content,
        created_at,
        id,
        profile:profiles(first_name, id, image_uri, last_name)
      ),
      created_at,
      id,
      inputs:event_inputs(id, input_id, input_option_id, value),
      profile:profiles(first_name, id, image_uri, last_name),
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
        session:sessions(
          id,
          protocol:protocols(id, name),
          order
        )
      )`,
    )
    .eq('id', eventId)
    .order('created_at', { referencedTable: 'comments' })
    .order('order', { referencedTable: 'inputs' })
    .order('order', { referencedTable: 'type.inputs' })
    .order('order', { referencedTable: 'type.inputs.input.options' })
    .single();

export type GetEventData = Awaited<ReturnType<typeof getEvent>>['data'];

export default getEvent;
