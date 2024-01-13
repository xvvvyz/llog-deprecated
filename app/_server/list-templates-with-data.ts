import createServerComponentClient from '@/_server/create-server-component-client';
import getCurrentTeamId from './get-current-team-id';

const listTemplatesWithData = async () =>
  createServerComponentClient()
    .from('templates')
    .select('data, id, name')
    .match({ team_id: await getCurrentTeamId() })
    .order('name');

export type ListTemplatesWithDataData = Awaited<
  ReturnType<typeof listTemplatesWithData>
>['data'];

export default listTemplatesWithData;
