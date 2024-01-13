import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import SubjectForm from '@/_components/subject-form';
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
  return { title: formatTitle([subject?.name, 'Edit']) };
};

export const revalidate = 0;

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) notFound();

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href="/subjects" />
        <Breadcrumbs
          items={[[subject.name, `/subjects/${subjectId}`], ['Edit']]}
        />
      </div>
      <SubjectForm subject={subject} />
    </>
  );
};

export default Page;
