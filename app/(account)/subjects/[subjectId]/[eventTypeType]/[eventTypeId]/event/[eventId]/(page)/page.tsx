import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import EventTypes from '(utilities)/enum-event-types';
import firstIfArray from '(utilities)/first-if-array';
import formatTitle from '(utilities)/format-title';
import getCurrentUser from '(utilities)/get-current-user';
import getEvent, { GetEventData } from '(utilities)/get-event';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../../../../(components)/event-card';

interface PageProps {
  params: {
    eventId: string;
    eventTypeType: EventTypes;
    subjectId: string;
  };
}

const Page = async ({
  params: { eventId, eventTypeType, subjectId },
}: PageProps) => {
  if (!Object.values(EventTypes).includes(eventTypeType)) notFound();

  const [{ data: subject }, { data: event }, user] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
    getCurrentUser(),
  ]);

  if (!subject || !event || !user) notFound();
  const eventType = firstIfArray(event.type);
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], [eventType.name]]} />
      </Header>
      <EventCard
        event={event as GetEventData}
        eventType={eventType}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { eventId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  if (!subject || !event) return;
  const eventType = firstIfArray(event.type);

  return { title: formatTitle([subject.name, eventType.name]) };
};

export default Page;
