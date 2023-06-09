import getCurrentUser from '@/(account)/_server/get-current-user';
import getMission from '@/(account)/_server/get-mission';
import getSession from '@/(account)/_server/get-session';
import getSubject from '@/(account)/_server/get-subject';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import formatTitle from '@/(account)/_utilities/format-title';
import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import { notFound } from 'next/navigation';

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
  const [{ data: mission }, { data: session }, user] = await Promise.all([
    getMission(missionId),
    getSession(sessionId),
    getCurrentUser(),
  ]);

  if (!mission || !session || !user) notFound();

  return forceArray(session.routines).map((routine) => {
    const event = firstIfArray(routine.event);

    return (
      <EventCard
        event={event}
        eventType={routine}
        key={routine.id}
        mission={mission}
        subjectId={subjectId}
        userId={user.id}
      />
    );
  });
};

export const generateMetadata = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission || !sessionId) return;
  const sessions = forceArray(mission.sessions);
  const sessionIndex = sessions.findIndex(({ id }) => id === sessionId);
  if (sessionIndex === -1) return null;

  return {
    title: formatTitle([subject.name, mission.name, String(sessionIndex + 1)]),
  };
};

export const revalidate = 0;
export default Page;
