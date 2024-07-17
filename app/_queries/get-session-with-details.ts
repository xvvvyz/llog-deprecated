import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getSessionWithDetails = (sessionId: string) =>
  createServerSupabaseClient()
    .from('sessions')
    .select(
      `
      draft,
      id,
      order,
      modules:event_types(
        content,
        event:events(
          comments(
            content,
            created_at,
            id,
            profile:profiles(first_name, id, image_uri, last_name)
          ),
          created_at,
          id,
          inputs:event_inputs(id, input_id, input_option_id, value),
          profile:profiles(first_name, id, image_uri, last_name)
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
        order
      ),
      scheduled_for,
      title`,
    )
    .eq('id', sessionId)
    .eq('modules.archived', false)
    .order('order', { referencedTable: 'modules' })
    .order('order', { referencedTable: 'modules.event.inputs' })
    .order('order', { referencedTable: 'modules.inputs' })
    .order('order', { referencedTable: 'modules.inputs.input.options' })
    .single();

export type GetSessionWithDetailsData = Awaited<
  ReturnType<typeof getSessionWithDetails>
>['data'];

export default getSessionWithDetails;
