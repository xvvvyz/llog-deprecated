import * as Modal from '@/_components/modal';
import ProtocolTemplateForm from '@/_components/protocol-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getProtocolForTemplate from '@/_queries/get-protocol-for-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplates from '@/_queries/list-templates';

interface PageProps {
  params: Promise<{ protocolId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { protocolId } = await params;

  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: subjects },
    { data: protocol },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    listTemplates({ type: TemplateType.Session }),
    listSubjectsByTeamId(),
    getProtocolForTemplate(protocolId),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !subjects ||
    !protocol
  ) {
    return null;
  }

  return (
    <Modal.Content>
      <ProtocolTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        availableSessionTemplates={availableSessionTemplates}
        disableCache
        isDuplicate
        subjects={subjects}
        template={{
          data: {
            sessions: protocol.sessions.map((session) => ({
              modules: session.modules.map((module) => ({
                content: module.content,
                inputIds: module.inputs.map((input) => input.id),
                name: module.name,
              })),
              title: session.title,
            })),
          },
          name: protocol.name ?? '',
        }}
        title="New protocol template"
      />
    </Modal.Content>
  );
};

export default Page;
