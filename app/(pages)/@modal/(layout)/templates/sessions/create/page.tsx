import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SessionTemplateForm from '@/_components/session-template-form';
import TemplateType from '@/_constants/enum-template-type';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplates from '@/_queries/list-templates';

const Page = async () => {
  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: subjects },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !availableModuleTemplates || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New session template" />
      <SessionTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        subjects={subjects}
      />
    </Modal.Content>
  );
};

export default Page;
