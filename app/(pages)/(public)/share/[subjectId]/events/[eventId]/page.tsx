import SubjectEventPage from '@/_components/subject-event-page';
import getPublicEvent from '@/_server/get-public-event';
import getPublicSubject from '@/_server/get-public-subject';
import firstIfArray from '@/_utilities/first-if-array';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { eventId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getPublicSubject(subjectId),
    getPublicEvent(eventId),
  ]);

  return {
    title: formatTitle([subject?.name, firstIfArray(event?.type)?.name]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { eventId, subjectId } }: PageProps) => (
  <SubjectEventPage eventId={eventId} isPublic subjectId={subjectId} />
);

export default Page;
