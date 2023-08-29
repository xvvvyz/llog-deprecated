import createServerComponentClient from '@/_server/create-server-component-client';
import getSubject from '@/_server/get-subject';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    shareCode: string;
    subjectId: string;
  };
}

const Page = async ({ params: { shareCode, subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);

  if (!subject) {
    await createServerComponentClient().rpc('join_subject_as_manager', {
      share_code: shareCode,
    });
  }

  redirect(`/subjects/${subjectId}/timeline`);
};

export default Page;
