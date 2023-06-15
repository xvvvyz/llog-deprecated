import createServerComponentClient from '@/_server/create-server-component-client';
import getCurrentTeamId from './get-current-team-id';

const listTemplates = async () =>
  createServerComponentClient()
    .from('templates')
    .select('data, id, name')
    .match({ team_id: await getCurrentTeamId() })
    .order('name');

export type ListTemplatesData = Awaited<
  ReturnType<typeof listTemplates>
>['data'];

export default listTemplates;
