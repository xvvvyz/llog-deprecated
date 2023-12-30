import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjectManagers = async (subjectId: string) =>
  createServerComponentClient()
    .from('subject_managers')
    .select('manager:profiles(id, image_uri, first_name)')
    .eq('subject_id', subjectId)
    .neq('profile_id', '70045ed0-b03c-46d8-a784-e05c15a770af');

export type ListSubjectManagersData = Awaited<
  ReturnType<typeof listSubjectManagers>
>['data'];

export default listSubjectManagers;
