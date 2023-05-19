import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import listInputs, { ListInputsData } from '(utilities)/list-inputs';
import TemplateForm from '../(components)/template-form';

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
