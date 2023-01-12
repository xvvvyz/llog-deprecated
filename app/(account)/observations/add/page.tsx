import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import listInputs from 'utilities/list-inputs';
import ObservationTypeForm from '../components/observation-type-form';

const Page = async () => {
  const { data: availableInputs } = await listInputs();

  return (
    <>
      <Header>
        <BackButton href="/observations" />
        <Breadcrumbs items={[['Add observation type']]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <ObservationTypeForm availableInputs={availableInputs} />
      </Card>
    </>
  );
};

export default Page;
