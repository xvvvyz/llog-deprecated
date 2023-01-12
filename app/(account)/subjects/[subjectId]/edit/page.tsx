import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import getSubjectWithObservations from 'utilities/get-subject-with-observations';
import listObservations from 'utilities/list-observations';
import SubjectForm from '../../components/subject-form';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubjectWithObservations(subjectId);
  if (!subject) return notFound();
  const { data: availableObservations } = await listObservations();

  return (
    <>
      <Header>
        <BackButton href="/subjects" />
        <Breadcrumbs
          items={[[subject.name, `/subjects/${subjectId}`], ['Edit']]}
        />
      </Header>
      <Card as="main" breakpoint="sm">
        <SubjectForm
          availableObservations={availableObservations}
          subject={subject}
        />
      </Card>
    </>
  );
};

export default Page;
