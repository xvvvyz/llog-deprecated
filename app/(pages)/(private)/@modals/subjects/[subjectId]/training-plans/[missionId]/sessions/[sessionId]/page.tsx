import SessionPage from '@/_components/session-page';
import getMissionWithSessions from '@/_queries/get-mission-with-sessions';
import getSubject from '@/_queries/get-subject';
import forceArray from '@/_utilities/force-array';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    sessionId: string;
    subjectId: string;
  };
  searchParams: {
    back?: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
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
  searchParams: { back },
}: PageProps) => (
  <SessionPage
    back={back}
    missionId={missionId}
    sessionId={sessionId}
    subjectId={subjectId}
  />
);

export default Page;
