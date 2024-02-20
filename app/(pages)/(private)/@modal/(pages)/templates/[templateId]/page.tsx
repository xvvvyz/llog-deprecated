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
  searchParams: {
    back?: string;
  };
}

export const generateMetadata = async ({
  params: { templateId },
}: PageProps) => {
  const { data: template } = await getTemplate(templateId);
  return { title: formatTitle(['Templates', template?.name]) };
};

const Page = async ({
  params: { templateId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();

  const [{ data: template }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getTemplate(templateId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!template || !availableInputs || !subjects) notFound();

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
