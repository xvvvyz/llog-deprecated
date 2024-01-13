import createServerComponentClient from '@/_server/create-server-component-client';
import getSubject from '@/_server/get-subject';

const getPublicSubject = (subjectId: string) =>
  createServerComponentClient().rpc('get_public_subject', {
    public_subject_id: subjectId,
  }) as ReturnType<typeof getSubject>;

export default getPublicSubject;
