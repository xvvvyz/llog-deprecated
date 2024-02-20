import SessionsPage from '@/_components/sessions-page';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getMissionWithSessionsAndEvents from '@/_queries/get-mission-with-sessions-and-events';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
  searchParams: {
    back?: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const user = await getCurrentUserFromSession();
  const { data: subject } = await getSubject(subjectId);
  const isTeamMember = subject?.team_id === user?.id;

  const { data: mission } = await getMissionWithSessionsAndEvents(missionId, {
    draft: isTeamMember,
  });

  return { title: formatTitle([subject?.name, mission?.name]) };
};

const Page = ({
  params: { missionId, subjectId },
  searchParams: { back },
}: PageProps) => (
  <SessionsPage back={back} missionId={missionId} subjectId={subjectId} />
);

export default Page;
