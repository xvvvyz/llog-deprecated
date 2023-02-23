import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';
import listInputs from '(utilities)/list-inputs';
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
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Settings', `${subjectHref}/settings`],
            ['Add mission'],
          ]}
        />
      </Header>
      <MissionForm
        availableInputs={availableInputs}
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
  return { title: formatTitle([subject.name, 'Settings', 'Add mission']) };
};

export default Page;
