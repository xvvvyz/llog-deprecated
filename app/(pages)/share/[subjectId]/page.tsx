import SubjectPage from '@/_components/subject-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { foo?: string; from?: string; limit?: string; to?: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Events']) };

const Page = async ({
  params: { subjectId },
  searchParams: { from, limit, to },
}: PageProps) => (
  <SubjectPage
    from={from}
    limit={limit}
    isPublic
    subjectId={subjectId}
    to={to}
  />
);

export default Page;
