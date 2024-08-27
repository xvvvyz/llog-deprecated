import InsightPage from '@/_components/insight-page';

interface PageProps {
  params: { insightId: string; subjectId: string };
  searchParams: { from?: string; to?: string };
}

const Page = async ({
  params: { insightId, subjectId },
  searchParams: { from, to },
}: PageProps) => (
  <InsightPage
    from={from}
    insightId={insightId}
    subjectId={subjectId}
    to={to}
  />
);

export default Page;
