import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import getObservation from 'utilities/get-observation';
import getSubject from 'utilities/get-subject';
import ObservationForm from './components/observation-form';

interface PageProps {
  params: {
    observationId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { observationId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: observation }] = await Promise.all([
    getSubject(subjectId),
    getObservation(observationId),
  ]);

  if (!subject || !observation) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/observation`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Observation', `${subjectHref}/observation`],
            [observation.name],
          ]}
        />
      </Header>
      <main>
        <Card breakpoint="sm">
          <ObservationForm observation={observation} subjectId={subjectId} />
        </Card>
      </main>
    </>
  );
};

export default Page;
