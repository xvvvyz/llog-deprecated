import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import getEventType from '(utilities)/get-event-type';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../../(components)/event-card';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventType(eventTypeId),
  ]);

  if (!subject || !eventType) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/event`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Event', `${subjectHref}/event`],
            [eventType.name ?? ''],
          ]}
        />
      </Header>
      <main>
        <EventCard eventType={eventType} subjectId={subjectId} />
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
