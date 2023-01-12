import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import listInputTypes from 'utilities/list-input-types';
import InputForm from '../components/input-form';

const Page = async () => {
  const { data: inputTypes } = await listInputTypes();

  return (
    <>
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Add input']]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <InputForm inputTypes={inputTypes} />
      </Card>
    </>
  );
};

export default Page;
