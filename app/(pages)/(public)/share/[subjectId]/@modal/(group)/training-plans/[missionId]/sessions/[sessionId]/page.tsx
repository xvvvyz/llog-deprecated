import SessionPage from '@/_components/session-page';
import getPublicMissionWithSessions from '@/_queries/get-public-mission-with-sessions';
import getPublicSubject from '@/_queries/get-public-subject';
import forceArray from '@/_utilities/force-array';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    sessionId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getPublicSubject(subjectId),
    getPublicMissionWithSessions(missionId),
  ]);

  const sessions = forceArray(mission?.sessions);
  const sessionIndex = sessions.findIndex(({ id }) => id === sessionId);

  return {
    title: formatTitle([
      subject?.name,
      mission?.name,
      String(sessionIndex + 1),
    ]),
  };
};

const Page = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => (
  <SessionPage
    isPublic
    missionId={missionId}
    sessionId={sessionId}
    subjectId={subjectId}
  />
);

export default Page;
