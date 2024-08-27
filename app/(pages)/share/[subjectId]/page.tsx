import SubjectPage from '@/_components/subject-page';

interface PageProps {
  params: { subjectId: string };
  searchParams: { foo?: string; from?: string; limit?: string; to?: string };
}

const Page = async ({
  params: { subjectId },
  searchParams: { from, limit, to },
}: PageProps) => (
  <SubjectPage
    from={from}
    limit={limit}
    isPublic
    subjectId={subjectId}
    to={to}
  />
);

export default Page;
