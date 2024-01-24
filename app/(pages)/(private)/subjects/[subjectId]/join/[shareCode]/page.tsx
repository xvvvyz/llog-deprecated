import getSubject from '@/_queries/get-subject';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
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
    await createServerSupabaseClient().rpc('join_subject_as_manager', {
      share_code: shareCode,
    });
  }

  redirect(`/subjects/${subjectId}`);
};

export default Page;
