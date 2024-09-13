import SessionPage from '@/_components/session-page';

interface PageProps {
  params: {
    sessionId: string;
    subjectId: string;
    protocolId: string;
  };
}

const Page = async ({
  params: { sessionId, subjectId, protocolId },
}: PageProps) => (
  <SessionPage
    sessionId={sessionId}
    subjectId={subjectId}
    protocolId={protocolId}
  />
);

export default Page;
