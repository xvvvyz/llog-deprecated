import PageModalHeader from '@/_components/page-modal-header';
import TemplateForm from '@/_components/template-form';
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
    <>
      <PageModalHeader title={template.name} />
      <TemplateForm
        availableInputs={availableInputs}
        subjects={subjects}
        template={template}
      />
    </>
  );
};

export default Page;
