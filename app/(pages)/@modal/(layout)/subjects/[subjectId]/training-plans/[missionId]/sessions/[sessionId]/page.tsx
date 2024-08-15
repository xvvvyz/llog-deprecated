import SessionPage from '@/_components/session-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    sessionId: string;
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Training plans', 'Sessions']),
};

const Page = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => (
  <SessionPage
    missionId={missionId}
    sessionId={sessionId}
    subjectId={subjectId}
  />
);

export default Page;
