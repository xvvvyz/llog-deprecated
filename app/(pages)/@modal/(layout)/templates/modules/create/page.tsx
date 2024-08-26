import * as Modal from '@/_components/modal';
import ModuleTemplateForm from '@/_components/module-template-form';
import PageModalHeader from '@/_components/page-modal-header';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

export const metadata = {
  title: formatTitle(['Templates', 'New']),
};

const Page = async () => {
  const [{ data: availableInputs }, { data: subjects }] = await Promise.all([
    listInputs(),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New module template" />
      <ModuleTemplateForm
        availableInputs={availableInputs}
        subjects={subjects}
      />
    </Modal.Content>
  );
};

export default Page;
