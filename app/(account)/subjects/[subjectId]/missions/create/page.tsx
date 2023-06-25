import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getSubject from '@/(account)/_server/get-subject';
import formatTitle from '@/(account)/_utilities/format-title';
import MissionForm from '@/(account)/subjects/[subjectId]/missions/_components/mission-form';
import { notFound } from 'next/navigation';

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);

  return {
    title: formatTitle([subject?.name, 'Create mission']),
  };
};

export const revalidate = 0;

interface PageProps {
  params: {
    subjectId: string;
  };
}

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
