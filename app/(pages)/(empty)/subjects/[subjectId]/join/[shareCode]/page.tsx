import getSubject from '@/_queries/get-subject';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ shareCode: string; subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { shareCode, subjectId } = await params;
  const { data: subject } = await getSubject(subjectId);

  if (!subject) {
    await (
      await createServerSupabaseClient()
    ).rpc('join_subject_as_client', { share_code: shareCode });
  }

  redirect(`/subjects/${subjectId}`);
};

export default Page;
