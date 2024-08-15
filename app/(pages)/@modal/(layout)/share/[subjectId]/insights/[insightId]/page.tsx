import InsightPage from '@/_components/insight-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { insightId: string; subjectId: string };
  searchParams: { from?: string; to?: string };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Insight']),
};

const Page = async ({
  params: { insightId, subjectId },
  searchParams: { from, to },
}: PageProps) => (
  <InsightPage
    from={from}
    insightId={insightId}
    isPublic
    subjectId={subjectId}
    to={to}
  />
);

export default Page;
