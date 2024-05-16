import SubjectEventsPage from '@/_components/subject-events-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { from?: string; limit?: string; to?: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Events']) };

const Page = ({
  params: { subjectId },
  searchParams: { from, limit, to },
}: PageProps) => (
  <SubjectEventsPage from={from} limit={limit} subjectId={subjectId} to={to} />
);

export default Page;
