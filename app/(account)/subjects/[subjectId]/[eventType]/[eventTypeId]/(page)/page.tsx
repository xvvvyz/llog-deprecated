import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import EventTypes from '(utilities)/enum-event-types';
import formatTitle from '(utilities)/format-title';
import getCurrentUser from '(utilities)/get-current-user';
import getEventTypeWithInputsAndOptions from '(utilities)/get-event-type-with-inputs-and-options';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../../(components)/event-card';

interface PageProps {
  params: {
    eventType: EventTypes;
    eventTypeId: string;
    subjectId: string;
  };
}

const Page = async ({
  params: { eventTypeId, eventType, subjectId },
}: PageProps) => {
  if (!Object.values(EventTypes).includes(eventType)) notFound();

  const [{ data: subject }, { data: type }, user] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
    getCurrentUser(),
  ]);

  if (!subject || !type || !user) notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], [type.name ?? '']]} />
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
