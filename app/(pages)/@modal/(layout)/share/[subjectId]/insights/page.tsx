import InsightsPage from '@/_components/insights-page';

interface PageProps {
  params: Promise<{ subjectId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { subjectId } = await params;

  return (
    <InsightsPage
      isPublic
      searchParams={await searchParams}
      subjectId={subjectId}
    />
  );
};

export default Page;
