import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getCurrentUser from '(utilities)/get-current-user';
import getEventTypeWithInputsAndOptions from '(utilities)/get-event-type-with-inputs-and-options';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../(components)/event-card';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: type }, user] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
    getCurrentUser(),
  ]);

  if (!subject || !type || !user) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [type.name ?? ''],
          ]}
        />
      </Header>
      <EventCard eventType={type} subjectId={subjectId} userId={user.id} />
    </>
  );
};

export const generateMetadata = async ({
  params: { eventTypeId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
  ]);

  if (!subject || !eventType) return;
  return { title: formatTitle([subject.name, eventType.name]) };
};

export const revalidate = 0;
export default Page;
