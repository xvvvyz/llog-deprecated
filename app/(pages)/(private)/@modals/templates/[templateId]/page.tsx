import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import TemplateForm from '@/_components/template-form';
import getTemplate from '@/_queries/get-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    templateId: string;
  };
}

export const generateMetadata = async ({
  params: { templateId },
}: PageProps) => {
  const { data: template } = await getTemplate(templateId);
  return { title: formatTitle(['Templates', template?.name]) };
};

const Page = async ({ params: { templateId } }: PageProps) => {
  const [{ data: template }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getTemplate(templateId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!template || !availableInputs || !subjects) notFound();
  const back = '/templates';

  return (
    <PageModal back={back} temporary_forcePath={`/templates/${templateId}`}>
      <PageModalHeader back={back} title={template.name} />
      <TemplateForm
        availableInputs={availableInputs}
        back={back}
        subjects={subjects}
        template={template}
      />
    </PageModal>
  );
};

export default Page;
