import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import TemplateForm from '@/_components/template-form';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

export const metadata = { title: formatTitle(['Templates', 'Create']) };

const Page = async () => {
  const [{ data: availableInputs }, { data: subjects }] = await Promise.all([
    listInputs(),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !subjects) notFound();
  const back = '/templates';

  return (
    <PageModal back={back} temporary_forcePath={`/templates/create`}>
      <PageModalHeader back={back} title="Create template" />
      <TemplateForm
        availableInputs={availableInputs}
        back={back}
        subjects={subjects}
      />
    </PageModal>
  );
};

export default Page;
