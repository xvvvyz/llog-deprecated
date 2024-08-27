import SubjectPage from '@/_components/subject-page';

interface PageProps {
  params: { subjectId: string };
  searchParams: { from?: string; limit?: string; to?: string };
}

const Page = ({
  params: { subjectId },
  searchParams: { from, limit, to },
}: PageProps) => (
  <SubjectPage from={from} limit={limit} subjectId={subjectId} to={to} />
);

export default Page;
