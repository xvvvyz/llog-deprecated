import InsightPage from '@/_components/insight-page';

interface PageProps {
  params: Promise<{ insightId: string; subjectId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { insightId, subjectId } = await params;
  const { from, to } = await searchParams;

  return (
    <InsightPage
      from={from}
      insightId={insightId}
      isPublic
      subjectId={subjectId}
      to={to}
    />
  );
};

export default Page;
