import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getSubject from '@/(account)/_server/get-subject';
import formatTitle from '@/(account)/_utilities/format-title';
import SubjectForm from '@/(account)/subjects/_components/subject-form';
import { notFound } from 'next/navigation';

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);

  return {
    title: formatTitle([subject?.name, 'Edit']),
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
        <BackButton href={'/subjects'} />
        <Breadcrumbs
          items={[[subject.name, `/subjects/${subjectId}/timeline`], ['Edit']]}
        />
      </Header>
      <SubjectForm subject={subject} />
    </>
  );
};

export default Page;
