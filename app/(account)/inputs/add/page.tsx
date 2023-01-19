import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import InputForm from '../components/input-form';

const Page = () => (
  <>
    <Header>
      <BackButton href="/inputs" />
      <Breadcrumbs items={[['Add input']]} />
    </Header>
    <Card as="main" breakpoint="sm">
      <InputForm />
    </Card>
  </>
);

export default Page;
