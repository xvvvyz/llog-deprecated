import createServerSupabaseClient from './create-server-supabase-client';
import EventTypes from './enum-event-types';
import getCurrentTeamId from './get-current-team-id';

const listRoutineTemplatesWithData = async () =>
  createServerSupabaseClient()
    .from('templates')
    .select('data, id, name, type')
    .match({
      team_id: await getCurrentTeamId(),
      type: EventTypes.Routine,
    })
    .order('type')
    .order('name');

export type ListRoutineTemplatesWithDataData = Awaited<
  ReturnType<typeof listRoutineTemplatesWithData>
>['data'];

export default listRoutineTemplatesWithData;
