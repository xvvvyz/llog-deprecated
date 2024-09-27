import SessionsPage from '@/_components/sessions-page';

interface PageProps {
  params: Promise<{ subjectId: string; protocolId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId, protocolId } = await params;
  return <SessionsPage subjectId={subjectId} protocolId={protocolId} />;
};

export default Page;
