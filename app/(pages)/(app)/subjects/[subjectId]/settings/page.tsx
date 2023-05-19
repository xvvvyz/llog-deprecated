import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getSubjectWithEventTypesAndMissions from '(utilities)/get-subject-with-event-types-and-missions';
import listTemplates from '(utilities)/list-templates';
import { notFound } from 'next/navigation';
import SubjectSettingsForm from './(components)/subject-settings-form';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: availableTemplates }] = await Promise.all([
    getSubjectWithEventTypesAndMissions(subjectId),
    listTemplates(),
  ]);

  if (!subject) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Settings'],
          ]}
        />
      </Header>
      <SubjectSettingsForm
        availableTemplates={availableTemplates}
        subject={subject}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubjectWithEventTypesAndMissions(
    subjectId
  );

  if (!subject) return;
  return { title: formatTitle([subject.name, 'Settings']) };
};

export const revalidate = 0;
export default Page;
