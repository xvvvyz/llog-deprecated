import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import getEventType from 'utilities/get-event-type';
import getSubject from 'utilities/get-subject';
import EventForm from './components/event-form';

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
            [eventType.name],
          ]}
        />
      </Header>
      <main>
        <Card breakpoint="sm">
          <EventForm eventType={eventType} subjectId={subjectId} />
        </Card>
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
