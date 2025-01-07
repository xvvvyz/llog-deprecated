import EventTypeTemplateForm from '@/_components/event-type-template-form';
import * as Modal from '@/_components/modal';
import getCommunityTemplate from '@/_queries/get-community-template';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';

interface PageProps {
  params: Promise<{ templateId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { templateId } = await params;

  const [{ data }, { data: subjects }] = await Promise.all([
    getCommunityTemplate(templateId),
    listSubjectsByTeamId(),
  ]);

  if (!data?.template || !data?.inputs || !subjects) return null;

  return (
    <Modal.Content>
      <EventTypeTemplateForm
        availableInputs={data.inputs}
        isDuplicate
        subjects={subjects}
        template={data.template}
        title="Edit event type template"
      />
    </Modal.Content>
  );
};

export default Page;
