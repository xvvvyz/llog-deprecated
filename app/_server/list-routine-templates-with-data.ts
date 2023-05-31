import EventTypes from '@/_constants/enum-event-types';
import createServerComponentClient from './create-server-component-client';
import getCurrentTeamId from './get-current-team-id';

const listRoutineTemplatesWithData = async () =>
  createServerComponentClient()
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
