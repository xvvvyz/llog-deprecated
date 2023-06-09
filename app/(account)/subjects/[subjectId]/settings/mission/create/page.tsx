import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getSubject from '@/(account)/_server/get-subject';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import listRoutineTemplatesWithData from '@/(account)/_server/list-routine-templates-with-data';
import filterListInputsDataBySubjectId from '@/(account)/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/(account)/_utilities/format-title';
import MissionForm from '@/(account)/subjects/[subjectId]/settings/mission/_components/mission-form';
import { notFound } from 'next/navigation';

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
    getSubject(subjectId),
    listInputs(),
    listRoutineTemplatesWithData(),
  ]);

  if (!subject) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Settings', `/subjects/${subjectId}/settings`],
            ['Create mission'],
          ]}
        />
      </Header>
      <MissionForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        availableTemplates={availableTemplates}
        subjectId={subjectId}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return;
  return { title: formatTitle([subject.name, 'Settings', 'Create mission']) };
};

export const revalidate = 0;
export default Page;
