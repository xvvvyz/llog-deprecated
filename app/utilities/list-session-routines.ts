import createServerSupabaseClient from 'utilities/create-server-supabase-client';

const listSessionRoutines = (
  missionId: string,
  sessionNumber: number | string
) =>
  createServerSupabaseClient()
    .from('event_types')
    .select(
      `
      content,
      event:events(
        id,
        inputs:event_inputs(
          id,
          input_id,
          input_option_id,
          value
        )
      ),
      id,
      inputs:event_type_inputs(
        input:inputs(
          id,
          label,
          options:input_options(id, label),
          type
        )
      ),
      name,
      type`
    )
    .eq('mission_id', missionId)
    .eq('session', Number(sessionNumber) - 1)
    .order('order')
    .order('order', { foreignTable: 'event_type_inputs' });

export type ListSessionRoutinesData = Awaited<
  ReturnType<typeof listSessionRoutines>
>['data'];

export default listSessionRoutines;
