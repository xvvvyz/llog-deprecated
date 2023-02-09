import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import firstIfArray from '(utilities)/first-if-array';
import formatSessionNumber from '(utilities)/format-session-number';
import formatTitle from '(utilities)/format-title';
import getEvent, { GetEventData } from '(utilities)/get-event';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../../(components)/event-card';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  if (!subject || !event) return notFound();
  const eventType = firstIfArray(event.type);
  const subjectHref = `/subjects/${subjectId}`;
  const sessionNumber = formatSessionNumber(eventType.session);

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            [
              eventType.mission ? eventType.mission.name : eventType.name,
              eventType.mission &&
                `${subjectHref}/mission/${eventType.mission.id}/session/${sessionNumber}`,
            ],
          ]}
        />
      </Header>
      <main>
        <EventCard
          event={event as GetEventData}
          eventType={eventType}
          mission={eventType.mission}
          subjectId={subjectId}
        />
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params: { eventId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  if (!subject || !event) return;
  const eventType = firstIfArray(event.type);

  return {
    title: formatTitle([
      subject.name,
      'Event',
      eventType.mission ? eventType.mission.name : eventType.name,
    ]),
  };
};

export default Page;
