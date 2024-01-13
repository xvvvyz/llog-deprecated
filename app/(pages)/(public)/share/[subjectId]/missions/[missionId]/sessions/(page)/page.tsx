import SubjectMissionSessionsPage from '@/_components/subject-mission-sessions-page';
import getPublicMissionWithSessionsAndEvents from '@/_server/get-public-mission-with-sessions-and-events';
import getPublicSubject from '@/_server/get-public-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const { data: subject } = await getPublicSubject(subjectId);

  const { data: mission } =
    await getPublicMissionWithSessionsAndEvents(missionId);

  return { title: formatTitle([subject?.name, mission?.name]) };
};

export const revalidate = 0;

const Page = ({ params: { missionId, subjectId } }: PageProps) => (
  <SubjectMissionSessionsPage
    isPublic
    missionId={missionId}
    subjectId={subjectId}
  />
);

export default Page;
