import PageModalHeader from '@/_components/page-modal-header';
import TemplateForm from '@/_components/template-form';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

export const metadata = { title: formatTitle(['Templates', 'Create']) };

const Page = async () => {
  const [{ data: availableInputs }, { data: subjects }] = await Promise.all([
    listInputs(),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !subjects) return null;

  return (
    <>
      <PageModalHeader title="Create template" />
      <TemplateForm availableInputs={availableInputs} subjects={subjects} />
    </>
  );
};

export default Page;
