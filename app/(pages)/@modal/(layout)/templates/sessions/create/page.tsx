import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SessionTemplateForm from '@/_components/session-template-form';
import TemplateType from '@/_constants/enum-template-type';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';

const Page = async () => {
  const [
    { data: availableInputs },
    { data: availableTemplates },
    { data: subjects },
  ] = await Promise.all([
    listInputs(),
    listTemplatesWithData({ type: TemplateType.Module }),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !availableTemplates || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New session template" />
      <SessionTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableTemplates}
        subjects={subjects}
      />
    </Modal.Content>
  );
};

export default Page;
