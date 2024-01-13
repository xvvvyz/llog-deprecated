import createServerComponentClient from '@/_server/create-server-component-client';
import getCurrentTeamId from './get-current-team-id';

const listInputs = async () =>
  createServerComponentClient()
    .from('inputs')
    .select('id, label, subjects(id, image_uri, name), type')
    .eq('team_id', (await getCurrentTeamId()) ?? '')
    .eq('archived', false)
    .eq('subjects.deleted', false)
    .order('name', { referencedTable: 'subjects' })
    .order('label');

export type ListInputsData = Awaited<ReturnType<typeof listInputs>>['data'];

export default listInputs;
