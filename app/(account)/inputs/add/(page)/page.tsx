import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import InputForm from '../../(components)/input-form';

const Page = () => (
  <>
    <Header>
      <BackButton href="/inputs" />
      <Breadcrumbs items={[['Inputs', '/inputs'], ['Add']]} />
    </Header>
    <InputForm />
  </>
);

export const metadata = { title: formatTitle(['Inputs', 'Add']) };
export default Page;
