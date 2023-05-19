import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import filterListInputsDataBySubjectId from '(utilities)/filter-list-inputs-data-by-subject-id';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';
import listInputs, { ListInputsData } from '(utilities)/list-inputs';
import listRoutineTemplatesWithData from '(utilities)/list-routine-templates-with-data';
import { notFound } from 'next/navigation';
import MissionForm from '../(components)/mission-form';

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
