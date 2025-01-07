import * as Modal from '@/_components/modal';
import ModuleTemplateForm from '@/_components/module-template-form';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';

const Page = async () => {
  const [{ data: availableInputs }, { data: subjects }] = await Promise.all([
    listInputs(),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !subjects) return null;

  return (
    <Modal.Content>
      <ModuleTemplateForm
        availableInputs={availableInputs}
        subjects={subjects}
        title="New module template"
      />
    </Modal.Content>
  );
};

export default Page;
