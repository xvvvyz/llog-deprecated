import EventTypeTemplateForm from '@/_components/event-type-template-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getTemplate from '@/_queries/get-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    templateId: string;
  };
}

export const metadata = { title: formatTitle(['Templates', 'Edit']) };

const Page = async ({ params: { templateId } }: PageProps) => {
  const [{ data: template }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getTemplate(templateId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!template || !availableInputs || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title={template.name} />
      <EventTypeTemplateForm
        availableInputs={availableInputs}
        subjects={subjects}
        template={template}
      />
    </Modal.Content>
  );
};

export default Page;
