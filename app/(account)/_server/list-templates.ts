import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';
import getCurrentTeamId from './get-current-team-id';

const listTemplates = async (
  type?: Database['public']['Enums']['template_type']
) => {
  const match: Database['public']['Tables']['templates']['Update'] = {
    team_id: await getCurrentTeamId(),
  };

  if (type) match.type = type;

  return createServerComponentClient()
    .from('templates')
    .select('id, name, type')
    .match(match)
    .order('type')
    .order('name');
};

export type ListTemplatesData = Awaited<
  ReturnType<typeof listTemplates>
>['data'];

export default listTemplates;
