import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Card from '(components)/card';
import Header from '(components)/header';
import EventTypes from '(utilities)/enum-event-types';
import getSubject from '(utilities)/get-subject';
import getTemplate from '(utilities)/get-template';
import listInputs from '(utilities)/list-inputs';
import { notFound } from 'next/navigation';
import EventTypeForm from '../(components)/event-type-form';

interface PageProps {
  params: {
    eventType: EventTypes;
    subjectId: string;
  };
  searchParams?: {
    templateId?: string;
  };
}

const Page = async ({
  params: { eventType, subjectId },
  searchParams,
}: PageProps) => {
  if (!Object.values(EventTypes).includes(eventType)) return notFound();

  const [{ data: subject }, { data: availableInputs }, { data: template }] =
    await Promise.all([
      getSubject(subjectId),
      listInputs(),
      searchParams?.templateId
        ? getTemplate(searchParams?.templateId)
        : Promise.resolve({ data: null }),
    ]);

  if (!subject) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Settings', `${subjectHref}/settings`],
            [`Add ${eventType}`],
          ]}
        />
      </Header>
      <Card as="main" breakpoint="sm">
        <EventTypeForm
          availableInputs={availableInputs}
          subjectId={subjectId}
          template={template}
          type={eventType as EventTypes}
        />
      </Card>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
