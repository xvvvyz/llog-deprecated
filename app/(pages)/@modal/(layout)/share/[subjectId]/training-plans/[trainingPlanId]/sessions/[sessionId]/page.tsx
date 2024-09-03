import SessionPage from '@/_components/session-page';

interface PageProps {
  params: {
    sessionId: string;
    subjectId: string;
    trainingPlanId: string;
  };
}

const Page = async ({
  params: { sessionId, subjectId, trainingPlanId },
}: PageProps) => (
  <SessionPage
    isPublic
    sessionId={sessionId}
    subjectId={subjectId}
    trainingPlanId={trainingPlanId}
  />
);

export default Page;
