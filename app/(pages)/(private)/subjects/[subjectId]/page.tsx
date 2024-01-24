import SubjectPage from '@/_components/subject-page';
import getSubject from '@/_queries/get-subject';

interface PageProps {
  params: { subjectId: string };
  searchParams: { to?: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: subject?.name };
};

const Page = async ({
  params: { subjectId },
  searchParams: { to },
}: PageProps) => <SubjectPage eventsTo={to} subjectId={subjectId} />;

export default Page;
