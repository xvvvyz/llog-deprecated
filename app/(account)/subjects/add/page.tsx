import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import listObservations from 'utilities/list-observations';
import SubjectForm from '../components/subject-form';

const Page = async () => {
  const { data: availableObservations } = await listObservations();

  return (
    <>
      <Header>
        <BackButton href="/subjects" />
        <Breadcrumbs items={[['Add subject']]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <SubjectForm availableObservations={availableObservations} />
      </Card>
    </>
  );
};

export default Page;
