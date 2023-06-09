import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjects = async () =>
  createServerComponentClient()
    .from('subjects')
    .select('id, image_uri, name, team_id')
    .not('team_id', 'is', null)
    .eq('deleted', false)
    .order('name');

export type ListSubjectsData = Awaited<ReturnType<typeof listSubjects>>['data'];
export default listSubjects;
