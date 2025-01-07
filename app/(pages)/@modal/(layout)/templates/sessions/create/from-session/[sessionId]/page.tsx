import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SessionTemplateForm from '@/_components/session-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getSession from '@/_queries/get-session';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplates from '@/_queries/list-templates';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { sessionId } = await params;

  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: session },
    { data: subjects },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    getSession(sessionId),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !availableModuleTemplates || !session || !subjects) {
    return null;
  }

  return (
    <Modal.Content>
      <PageModalHeader title="New session template" />
      <SessionTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        disableCache
        isDuplicate
        subjects={subjects}
        template={{
          data: {
            modules: session.modules.map((module) => ({
              content: module.content,
              inputIds: module.inputs.map((i) => i.input_id),
              name: module.name,
            })),
          },
          name: session.title ?? '',
        }}
        title="New session template"
      />
    </Modal.Content>
  );
};

export default Page;
