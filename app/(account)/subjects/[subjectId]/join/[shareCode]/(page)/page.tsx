import createServerSupabaseClient from '(utilities)/create-server-supabase-client';
import getSubject from '(utilities)/get-subject';
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
  return null;
};

export const revalidate = 0;
export default Page;
