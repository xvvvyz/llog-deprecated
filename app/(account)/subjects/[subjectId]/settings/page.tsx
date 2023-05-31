import SubjectSettingsForm from '@/(account)/subjects/[subjectId]/settings/_components/subject-settings-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import getSubjectWithEventTypesAndMissions from '@/_server/get-subject-with-event-types-and-missions';
import listTemplates from '@/_server/list-templates';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

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
