import SessionsPage from '@/_components/sessions-page';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Page = ({ params: { missionId, subjectId } }: PageProps) => (
  <SessionsPage missionId={missionId} subjectId={subjectId} />
);

export default Page;
