import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import getSubjectWithEventTypes from 'utilities/get-subject-with-event-types';
import listInputs from 'utilities/list-inputs';
import listTemplates from 'utilities/list-templates';
import SubjectForm from '../../components/subject-form';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: availableInputs },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubjectWithEventTypes(subjectId),
    listInputs(),
    listTemplates(),
  ]);

  if (!subject) return notFound();

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
          availableInputs={availableInputs}
          availableTemplates={availableTemplates}
          subject={subject}
        />
      </Card>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
