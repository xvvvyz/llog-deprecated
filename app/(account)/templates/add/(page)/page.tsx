import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Card from '(components)/card';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import listInputs from '(utilities)/list-inputs';
import TemplateForm from '../../(components)/template-form';

const Page = async () => {
  const { data: availableInputs } = await listInputs();

  return (
    <>
      <Header>
        <BackButton href="/templates" />
        <Breadcrumbs items={[['Templates', '/templates'], ['Add']]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <TemplateForm availableInputs={availableInputs} />
      </Card>
    </>
  );
};

export const dynamic = 'force-dynamic';
export const metadata = { title: formatTitle(['Templates', 'Add']) };
export default Page;
