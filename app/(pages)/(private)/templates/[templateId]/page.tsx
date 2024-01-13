import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import TemplateForm from '@/_components/template-form';
import getTemplate from '@/_server/get-template';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
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

export const revalidate = 0;

const Page = async ({ params: { templateId } }: PageProps) => {
  const [{ data: template }, { data: availableInputs }] = await Promise.all([
    getTemplate(templateId),
    listInputs(),
  ]);

  if (!template) notFound();

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href="/templates" />
        <Breadcrumbs items={[['Templates', '/templates'], [template.name]]} />
      </div>
      <TemplateForm
        availableInputs={availableInputs as ListInputsData}
        template={template}
      />
    </>
  );
};

export default Page;
