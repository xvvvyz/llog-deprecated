import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import EventTypes from '(utilities)/enum-event-types';
import filterListInputsDataBySubjectId from '(utilities)/filter-list-inputs-data-by-subject-id';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';
import listInputs, { ListInputsData } from '(utilities)/list-inputs';
import { notFound } from 'next/navigation';
import EventTypeForm from '../event-type-form';

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
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Settings', `${subjectHref}/settings`],
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
