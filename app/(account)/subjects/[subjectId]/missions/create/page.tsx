import MissionForm from '@/(account)/subjects/[subjectId]/missions/_components/mission-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import getSubject from '@/_server/get-subject';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);

  return {
    title: formatTitle([subject?.name, 'Create mission']),
  };
};

export const revalidate = 0;

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Create mission'],
          ]}
        />
      </Header>
      <MissionForm subjectId={subjectId} />
    </>
  );
};

export default Page;
