import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    shareCode: string;
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) =>
  redirect(`/subjects/${subjectId}`);

export default Page;
