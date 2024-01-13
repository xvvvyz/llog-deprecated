import createServerComponentClient from '@/_server/create-server-component-client';

const getSession = (sessionId: string) =>
  createServerComponentClient()
    .from('sessions')
    .select(
      `
      draft,
      id,
      order,
      modules:event_types(
        content,
        event:events(
          id,
          profile:profiles(first_name, id, last_name)
        ),
        id,
        inputs:event_type_inputs(input_id),
        order
      ),
      scheduled_for,
      title`,
    )
    .eq('id', sessionId)
    .eq('modules.archived', false)
    .order('order', { referencedTable: 'modules' })
    .order('order', { referencedTable: 'modules.inputs' })
    .single();

export type GetSessionData = Awaited<ReturnType<typeof getSession>>['data'];

export default getSession;
