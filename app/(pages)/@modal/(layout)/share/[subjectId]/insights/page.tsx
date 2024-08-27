import InsightsPage from '@/_components/insights-page';

interface PageProps {
  params: { subjectId: string };
  searchParams: { foo?: string; from?: string; to?: string };
}

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => (
  <InsightsPage isPublic searchParams={searchParams} subjectId={subjectId} />
);

export default Page;
