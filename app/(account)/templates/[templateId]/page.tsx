import TemplateForm from '@/(account)/templates/_components/template-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import getTemplate from '@/_server/get-template';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    templateId: string;
  };
}

const Page = async ({ params: { templateId } }: PageProps) => {
  const [{ data: template }, { data: availableInputs }] = await Promise.all([
    getTemplate(templateId),
    listInputs(),
  ]);

  if (!template) notFound();

  return (
    <>
      <Header>
        <BackButton href="/templates" />
        <Breadcrumbs items={[['Templates', '/templates'], [template.name]]} />
      </Header>
      <TemplateForm
        availableInputs={availableInputs as ListInputsData}
        template={template}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { templateId },
}: PageProps) => {
  const { data: template } = await getTemplate(templateId);
  if (!template) return;
  return { title: formatTitle(['Templates', template.name]) };
};

export const revalidate = 0;
export default Page;
