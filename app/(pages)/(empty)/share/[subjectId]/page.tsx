import SubjectPage from '@/_components/subject-page';

interface PageProps {
  params: Promise<{ subjectId: string }>;
  searchParams: Promise<{ from?: string; limit?: string; to?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { subjectId } = await params;
  const { from, limit, to } = await searchParams;

  return (
    <SubjectPage
      from={from}
      limit={limit}
      isPublic
      subjectId={subjectId}
      to={to}
    />
  );
};

export default Page;
