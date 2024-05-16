import SessionsPage from '@/_components/sessions-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Training plans']) };

const Page = ({ params: { missionId, subjectId } }: PageProps) => (
  <SessionsPage isPublic missionId={missionId} subjectId={subjectId} />
);

export default Page;
