import SubjectPage from '@/_components/subject-page';
import getPublicSubject from '@/_queries/get-public-subject';

interface PageProps {
  params: { subjectId: string };
  searchParams: { to?: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getPublicSubject(subjectId);
  return { title: subject?.name };
};

const Page = async ({
  params: { subjectId },
  searchParams: { to },
}: PageProps) => <SubjectPage eventsTo={to} isPublic subjectId={subjectId} />;

export default Page;
