import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Card from '(components)/card';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getEventTypeWithInputs from '(utilities)/get-event-type-with-inputs';
import getSubject from '(utilities)/get-subject';
import listInputs from '(utilities)/list-inputs';
import capitalize from 'lodash/capitalize';
import { notFound } from 'next/navigation';
import EventTypeForm from '../../(components)/event-type-form';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventType }, { data: availableInputs }] =
    await Promise.all([
      getSubject(subjectId),
      getEventTypeWithInputs(eventTypeId),
      listInputs(),
    ]);

  if (!subject || !eventType) notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Settings', `${subjectHref}/settings`],
            [eventType.name ?? ''],
          ]}
        />
      </Header>
      <main>
        <Card breakpoint="sm">
          <EventTypeForm
            availableInputs={availableInputs}
            eventType={eventType}
            subjectId={subjectId}
          />
        </Card>
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params: { eventTypeId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputs(eventTypeId),
  ]);

  if (!subject || !eventType) return;

  return {
    title: formatTitle([
      subject.name,
      'Settings',
      capitalize(eventType.type),
      eventType.name,
    ]),
  };
};

export default Page;
