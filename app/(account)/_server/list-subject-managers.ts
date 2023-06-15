import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjectManagers = async (subjectId: string) =>
  createServerComponentClient()
    .from('subject_managers')
    .select('manager:profiles(id, first_name)')
    .eq('subject_id', subjectId);

export type ListSubjectManagersData = Awaited<
  ReturnType<typeof listSubjectManagers>
>['data'];

export default listSubjectManagers;
