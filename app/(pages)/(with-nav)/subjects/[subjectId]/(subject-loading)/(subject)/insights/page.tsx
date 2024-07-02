import SubjectInsightsPage from '@/_components/subject-insights-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { from?: string; to?: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Insights']) };

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => (
  <SubjectInsightsPage searchParams={searchParams} subjectId={subjectId} />
);

export default Page;
