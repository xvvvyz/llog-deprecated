import InsightsPage from '@/_components/insights-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { foo?: string; from?: string; to?: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Insights']) };

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => (
  <InsightsPage isPublic searchParams={searchParams} subjectId={subjectId} />
);

export default Page;
