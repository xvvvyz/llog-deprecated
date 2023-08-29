import TemplateForm from '@/(account)/templates/_components/template-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import formatTitle from '@/_utilities/format-title';

export const metadata = {
  title: formatTitle(['Templates', 'Create']),
};

export const revalidate = 0;

const Page = async () => {
  const { data: availableInputs } = await listInputs();

  return (
    <>
      <Header>
        <BackButton href="/templates" />
        <Breadcrumbs items={[['Templates', '/templates'], ['Create']]} />
      </Header>
      <TemplateForm availableInputs={availableInputs as ListInputsData} />
    </>
  );
};

export default Page;
