import createServerSupabaseClient from './create-server-supabase-client';

const getObservation = (observationId: string) =>
  createServerSupabaseClient()
    .from('observations')
    .select(
      'id, name, inputs:observation_inputs(order, input:inputs(id, label, options:input_options(id, label), type(id, label)))'
    )
    .eq('id', observationId)
    .order('order', { ascending: true, foreignTable: 'observation_inputs' })
    .single();

export type GetObservationData = Awaited<
  ReturnType<typeof getObservation>
>['data'];

export default getObservation;
