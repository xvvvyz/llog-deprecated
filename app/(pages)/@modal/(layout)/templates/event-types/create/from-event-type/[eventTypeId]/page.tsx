import EventTypeTemplateForm from '@/_components/event-type-template-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getEventTypeWithInputs from '@/_queries/get-event-type-with-inputs';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventTypeId: string;
  };
}

export const metadata = { title: formatTitle(['Templates', 'New']) };

const Page = async ({ params: { eventTypeId } }: PageProps) => {
  const [{ data: eventType }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getEventTypeWithInputs(eventTypeId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!eventType || !availableInputs || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New event type template" />
      <EventTypeTemplateForm
        availableInputs={availableInputs}
        disableCache
        isDuplicate
        subjects={subjects}
        template={{
          data: {
            content: eventType.content,
            inputIds: eventType.inputs.map((i) => i.input_id),
          },
          id: eventType.id,
          name: eventType.name!,
        }}
      />
    </Modal.Content>
  );
};

export default Page;
