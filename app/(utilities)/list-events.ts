import { Database } from '(types)/database';
import createServerSupabaseClient from './create-server-supabase-client';

const listEvents = (subjectId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      `
      comments(
        content,
        created_at,
        id,
        profile:profiles(first_name, id, last_name)
      ),
      created_at,
      id,
      inputs:event_inputs(
        input:inputs(id, label, type),
        option:input_options(id, label),
        value
      ),
      profile:profiles(first_name, id, last_name),
      type:event_types(
        content,
        id,
        session:sessions(
          id,
          mission:missions(id, name),
          order
        ),
        name,
        order,
        type
      )`
    )
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .order('created_at', { foreignTable: 'comments' });

export type ListEventsData = Awaited<ReturnType<typeof listEvents>>['data'] & {
  comments: Array<
    Pick<Database['public']['Tables']['comments']['Row'], 'content' | 'id'> & {
      profile: Pick<
        Database['public']['Tables']['profiles']['Row'],
        'first_name' | 'id' | 'last_name'
      >;
    }
  >;
  inputs: Array<
    Pick<Database['public']['Tables']['event_inputs']['Row'], 'value'> & {
      input: Pick<
        Database['public']['Tables']['inputs']['Row'],
        'id' | 'label' | 'type'
      >;
      option: Pick<
        Database['public']['Tables']['input_options']['Row'],
        'id' | 'label'
      >;
    }
  >;
  profile: Pick<
    Database['public']['Tables']['profiles']['Row'],
    'first_name' | 'id' | 'last_name'
  >;
  type: Pick<
    Database['public']['Tables']['event_types']['Row'],
    'content' | 'id' | 'name' | 'order' | 'type'
  > & {
    session: Pick<
      Database['public']['Tables']['sessions']['Row'],
      'id' | 'order'
    > & {
      mission: Pick<
        Database['public']['Tables']['missions']['Row'],
        'id' | 'name'
      >;
    };
  };
};

export default listEvents;
