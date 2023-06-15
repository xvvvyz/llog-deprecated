import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getMission from '@/(account)/_server/get-mission';
import getSession from '@/(account)/_server/get-session';
import getSubject from '@/(account)/_server/get-subject';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import formatTitle from '@/(account)/_utilities/format-title';
import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import { notFound } from 'next/navigation';

export const generateMetadata = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
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

export const revalidate = 0;

interface PageProps {
  params: {
    missionId: string;
    sessionId: string;
    subjectId: string;
  };
}

const Page = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: session },
    user,
    teamId,
  ] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
    getSession(sessionId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject || !mission || !session || !user) notFound();

  return forceArray(session.modules).map((module) => {
    const event = firstIfArray(module.event);

    return (
      <EventCard
        event={event}
        eventType={module}
        isTeamMember={subject.team_id === teamId}
        key={module.id}
        mission={mission}
        subjectId={subjectId}
        userId={user.id}
      />
    );
  });
};

export default Page;
