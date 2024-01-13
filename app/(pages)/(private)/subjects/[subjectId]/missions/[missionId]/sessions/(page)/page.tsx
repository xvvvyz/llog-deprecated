import SubjectMissionSessionsPage from '@/_components/subject-mission-sessions-page';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getMissionWithSessionsAndEvents from '@/_server/get-mission-with-sessions-and-events';
import getSubject from '@/_server/get-subject';
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
  const [{ data: subject }, teamId] = await Promise.all([
    getSubject(subjectId),
    getCurrentTeamId(),
  ]);

  const isTeamMember = subject?.team_id === teamId;

  const { data: mission } = await getMissionWithSessionsAndEvents(missionId, {
    draft: isTeamMember,
  });

  return { title: formatTitle([subject?.name, mission?.name]) };
};

export const revalidate = 0;

const Page = ({ params: { missionId, subjectId } }: PageProps) => (
  <SubjectMissionSessionsPage missionId={missionId} subjectId={subjectId} />
);

export default Page;
