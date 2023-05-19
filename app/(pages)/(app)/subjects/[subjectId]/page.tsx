import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = ({ params: { subjectId } }: PageProps) =>
  redirect(`/subjects/${subjectId}/timeline`);

export default Page;
