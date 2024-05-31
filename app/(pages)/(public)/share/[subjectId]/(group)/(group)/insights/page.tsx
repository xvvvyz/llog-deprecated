import SubjectInsightsPage from '@/_components/subject-insights-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { foo?: string; from?: string; limit?: string; to?: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Insights']) };

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => (
  <SubjectInsightsPage
    isPublic
    searchParams={searchParams}
    subjectId={subjectId}
  />
);

export default Page;
