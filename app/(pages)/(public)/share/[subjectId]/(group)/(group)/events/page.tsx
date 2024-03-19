import SubjectEventsPage from '@/_components/subject-events-page';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { foo?: string; from?: string; limit?: string; to?: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Events']) };
};

const Page = async ({
  params: { subjectId },
  searchParams: { from, limit, to },
}: PageProps) => (
  <SubjectEventsPage
    from={from}
    limit={limit}
    isPublic
    subjectId={subjectId}
    to={to}
  />
);

export default Page;
