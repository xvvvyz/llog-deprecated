import SubjectPage from '@/_components/subject-page';
import getSubject from '@/_server/get-subject';

interface PageProps {
  params: { subjectId: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: subject?.name };
};

export const revalidate = 0;

const Page = async ({ params: { subjectId } }: PageProps) => (
  <SubjectPage subjectId={subjectId} />
);

export default Page;
