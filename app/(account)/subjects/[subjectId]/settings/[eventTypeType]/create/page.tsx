import EventTypeForm from '@/(account)/subjects/[subjectId]/settings/[eventTypeType]/_components/event-type-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import EventTypes from '@/_constants/enum-event-types';
import getSubject from '@/_server/get-subject';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    eventTypeType: EventTypes;
    subjectId: string;
  };
}

const Page = async ({ params: { eventTypeType, subjectId } }: PageProps) => {
  if (!Object.values(EventTypes).includes(eventTypeType)) notFound();

  const [{ data: subject }, { data: availableInputs }] = await Promise.all([
    getSubject(subjectId),
    listInputs(),
  ]);

  if (!subject) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Settings', `/subjects/${subjectId}/settings`],
            [`Create ${eventTypeType}`],
          ]}
        />
      </Header>
      <EventTypeForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        subjectId={subjectId}
        type={eventTypeType as EventTypes}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { eventTypeType, subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return;

  return {
    title: formatTitle([subject.name, 'Settings', `Create ${eventTypeType}`]),
  };
};

export const revalidate = 0;
export default Page;
