import SubjectEventPage from '@/_components/subject-event-page';
import getEvent from '@/_server/get-event';
import getSubject from '@/_server/get-subject';
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
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  return {
    title: formatTitle([subject?.name, firstIfArray(event?.type)?.name]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { eventId, subjectId } }: PageProps) => (
  <SubjectEventPage eventId={eventId} subjectId={subjectId} />
);

export default Page;
