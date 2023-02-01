import createServerSupabaseClient from './create-server-supabase-client';

const getEvent = (eventId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select('id, inputs:event_inputs(id, input_id, input_option_id, value)')
    .eq('id', eventId)
    .single();

export type GetEventData = Awaited<ReturnType<typeof getEvent>>['data'];

export default getEvent;
