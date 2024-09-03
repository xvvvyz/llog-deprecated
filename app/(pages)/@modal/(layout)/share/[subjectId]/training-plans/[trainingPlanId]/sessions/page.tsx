import SessionsPage from '@/_components/sessions-page';

interface PageProps {
  params: {
    subjectId: string;
    trainingPlanId: string;
  };
}

const Page = ({ params: { subjectId, trainingPlanId } }: PageProps) => (
  <SessionsPage
    isPublic
    subjectId={subjectId}
    trainingPlanId={trainingPlanId}
  />
);

export default Page;
