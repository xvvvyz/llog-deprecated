import InsightsPage from '@/_components/insights-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { from?: string; to?: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Insights']) };

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => (
  <InsightsPage searchParams={searchParams} subjectId={subjectId} />
);

export default Page;
