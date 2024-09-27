import SessionPage from '@/_components/session-page';

interface PageProps {
  params: Promise<{ sessionId: string; subjectId: string; protocolId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { sessionId, subjectId, protocolId } = await params;

  return (
    <SessionPage
      isPublic
      sessionId={sessionId}
      subjectId={subjectId}
      protocolId={protocolId}
    />
  );
};

export default Page;
