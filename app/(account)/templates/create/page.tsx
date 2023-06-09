import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import formatTitle from '@/(account)/_utilities/format-title';
import TemplateForm from '@/(account)/templates/_components/template-form';

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

export const metadata = { title: formatTitle(['Templates', 'Create']) };
export const revalidate = 0;
export default Page;
