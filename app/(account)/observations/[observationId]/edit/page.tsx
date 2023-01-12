import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import getObservation from 'utilities/get-observation';
import listInputs from 'utilities/list-inputs';
import ObservationTypeForm from '../../components/observation-type-form';

interface PageProps {
  params: {
    observationId: string;
  };
}

const Page = async ({ params: { observationId } }: PageProps) => {
  const { data: observation } = await getObservation(observationId);
  if (!observation) return notFound();
  const { data: availableInputs } = await listInputs();

  return (
    <>
      <Header>
        <BackButton href="/observations" />
        <Breadcrumbs items={[[observation.name], ['Edit']]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <ObservationTypeForm
          availableInputs={availableInputs}
          observation={observation}
        />
      </Card>
    </>
  );
};

export default Page;
