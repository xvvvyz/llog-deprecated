import SessionsPage from '@/_components/sessions-page';
import getPublicMissionWithSessionsAndEvents from '@/_queries/get-public-mission-with-sessions-and-events';
import getPublicSubject from '@/_queries/get-public-subject';
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
  const { data: subject } = await getPublicSubject(subjectId);

  const { data: mission } =
    await getPublicMissionWithSessionsAndEvents(missionId);

  return { title: formatTitle([subject?.name, mission?.name]) };
};

const Page = ({
  params: { missionId, subjectId },
  searchParams: { back },
}: PageProps) => (
  <SessionsPage
    back={back}
    isPublic
    missionId={missionId}
    subjectId={subjectId}
  />
);

export default Page;
