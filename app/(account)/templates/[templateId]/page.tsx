import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getTemplate from '@/(account)/_server/get-template';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import formatTitle from '@/(account)/_utilities/format-title';
import TemplateForm from '@/(account)/templates/_components/template-form';
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

  return {
    title: formatTitle(['Templates', template?.name]),
  };
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

export default Page;
