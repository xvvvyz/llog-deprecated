import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import EventTypes from '(utilities)/enum-event-types';
import getEventTypeWithInputsAndOptions from '(utilities)/get-event-type-with-inputs-and-options';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../../(components)/event-card';

interface PageProps {
  params: {
    eventTypeId: string;
    eventTypeType: EventTypes;
    subjectId: string;
  };
}

const Page = async ({
  params: { eventTypeId, eventTypeType, subjectId },
}: PageProps) => {
  if (!Object.values(EventTypes).includes(eventTypeType)) return notFound();

  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
  ]);

  if (!subject || !eventType) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs
          items={[[subject.name, subjectHref], [eventType.name ?? '']]}
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
