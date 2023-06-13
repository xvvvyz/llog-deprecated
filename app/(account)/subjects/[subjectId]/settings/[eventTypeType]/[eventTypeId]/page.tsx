import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getEventTypeWithInputs from '@/(account)/_server/get-event-type-with-inputs';
import getSubject from '@/(account)/_server/get-subject';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/(account)/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/(account)/_utilities/format-title';
import EventTypeForm from '@/(account)/subjects/[subjectId]/settings/[eventTypeType]/_components/event-type-form';
import { notFound } from 'next/navigation';

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

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Settings', `/subjects/${subjectId}/settings`],
            [eventType.name ?? ''],
          ]}
        />
      </Header>
      <EventTypeForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        eventType={eventType}
        subjectId={subjectId}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { eventTypeId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputs(eventTypeId),
  ]);

  if (!subject || !eventType) return;
  return { title: formatTitle([subject.name, 'Settings', eventType.name]) };
};

export default Page;
