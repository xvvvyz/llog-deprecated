import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getSession = (sessionId: string) =>
  createServerComponentClient()
    .from('sessions')
    .select(
      `
      id,
      order,
      modules:event_types(
        content,
        events:events(id),
        id,
        inputs:event_type_inputs(input_id),
        order
      ),
      scheduled_for,
      title`
    )
    .eq('id', sessionId)
    .eq('modules.deleted', false)
    .order('order', { foreignTable: 'modules' })
    .order('order', { foreignTable: 'modules.inputs' })
    .single();

export type GetSessionData = Awaited<ReturnType<typeof getSession>>['data'] & {
  modules: Array<
    Pick<
      Database['public']['Tables']['event_types']['Row'],
      'content' | 'id' | 'order'
    > & {
      events: Array<Pick<Database['public']['Tables']['events']['Row'], 'id'>>;
      inputs: Array<
        Pick<
          Database['public']['Tables']['event_type_inputs']['Row'],
          'input_id'
        >
      >;
    }
  >;
};

export default getSession;
