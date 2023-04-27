import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import EventTypes from '(utilities)/enum-event-types';
import filterListInputsDataBySubjectId from '(utilities)/filter-list-inputs-data-by-subject-id';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';
import getTemplate from '(utilities)/get-template';
import listInputs, { ListInputsData } from '(utilities)/list-inputs';
import { notFound } from 'next/navigation';
import EventTypeForm from '../../../../(components)/event-type-form';

interface PageProps {
  params: {
    eventTypeType: EventTypes;
    subjectId: string;
    templateId: string;
  };
}

const Page = async ({
  params: { eventTypeType, subjectId, templateId },
}: PageProps) => {
  if (!Object.values(EventTypes).includes(eventTypeType)) notFound();

  const [{ data: subject }, { data: availableInputs }, { data: template }] =
    await Promise.all([
      getSubject(subjectId),
      listInputs(),
      getTemplate(templateId),
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
            [`Add ${eventTypeType}`],
          ]}
        />
      </Header>
      <EventTypeForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        subjectId={subjectId}
        template={template}
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
    title: formatTitle([subject.name, 'Settings', `Add ${eventTypeType}`]),
  };
};

export const revalidate = 0;
export default Page;
