import InsightsPage from '@/_components/insights-page';

interface PageProps {
  params: { subjectId: string };
  searchParams: { from?: string; to?: string };
}

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => (
  <InsightsPage searchParams={searchParams} subjectId={subjectId} />
);

export default Page;
