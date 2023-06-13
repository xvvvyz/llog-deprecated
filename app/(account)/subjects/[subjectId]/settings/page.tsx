import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getSubjectWithEventTypesAndMissions from '@/(account)/_server/get-subject-with-event-types-and-missions';
import listTemplates from '@/(account)/_server/list-templates';
import formatTitle from '@/(account)/_utilities/format-title';
import SubjectSettingsForm from '@/(account)/subjects/[subjectId]/settings/_components/subject-settings-form';
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

export default Page;
