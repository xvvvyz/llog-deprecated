import createServerComponentClient from '@/_server/create-server-component-client';

const getSubject = (subjectId: string) =>
  createServerComponentClient()
    .from('subjects')
    .select('banner, id, image_uri, name, team_id')
    .eq('id', subjectId)
    .single();

export type GetSubjectData = Awaited<ReturnType<typeof getSubject>>['data'];
export default getSubject;
