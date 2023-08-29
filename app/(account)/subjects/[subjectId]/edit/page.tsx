import SubjectForm from '@/(account)/subjects/_components/subject-form';
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
    title: formatTitle([subject?.name, 'Edit']),
  };
};

export const revalidate = 0;

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
