import SubjectEventsPage from '@/_components/subject-events-page';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: { subjectId: string };
  searchParams: { to?: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Events']) };
};

const Page = async ({
  params: { subjectId },
  searchParams: { to },
}: PageProps) => (
  <SubjectEventsPage eventsTo={to} isPublic subjectId={subjectId} />
);

export default Page;
