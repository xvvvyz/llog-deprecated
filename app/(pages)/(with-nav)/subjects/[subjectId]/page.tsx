import SubjectPage from '@/_components/subject-page';

interface PageProps {
  params: Promise<{ subjectId: string }>;
  searchParams: Promise<{ from?: string; limit?: string; to?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { from, limit, to } = await searchParams;
  const { subjectId } = await params;

  return (
    <SubjectPage from={from} limit={limit} subjectId={subjectId} to={to} />
  );
};

export default Page;
