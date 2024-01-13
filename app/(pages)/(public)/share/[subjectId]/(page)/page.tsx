import SubjectPage from '@/_components/subject-page';
import getPublicSubject from '@/_server/get-public-subject';

interface PageProps {
  params: { subjectId: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getPublicSubject(subjectId);
  return { title: subject?.name };
};

export const revalidate = 60;

const Page = async ({ params: { subjectId } }: PageProps) => (
  <SubjectPage isPublic subjectId={subjectId} />
);

export default Page;
