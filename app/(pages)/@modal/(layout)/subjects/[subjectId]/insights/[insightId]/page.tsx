import InsightPage from '@/_components/insight-page';

interface PageProps {
  params: Promise<{ insightId: string; subjectId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { from, to } = await searchParams;
  const { insightId, subjectId } = await params;

  return (
    <InsightPage
      from={from}
      insightId={insightId}
      subjectId={subjectId}
      to={to}
    />
  );
};

export default Page;
