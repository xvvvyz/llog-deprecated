import createServerComponentClient from './create-server-component-client';

const getSubject = (subjectId: string) =>
  createServerComponentClient()
    .from('subjects')
    .select('id, image_uri, name, team_id')
    .eq('id', subjectId)
    .single();

export type GetSubjectData = Awaited<ReturnType<typeof getSubject>>['data'];
export default getSubject;
