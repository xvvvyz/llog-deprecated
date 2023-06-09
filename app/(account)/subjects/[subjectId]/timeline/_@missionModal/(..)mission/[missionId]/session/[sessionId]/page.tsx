import getCurrentUser from '@/(account)/_server/get-current-user';
import getMission from '@/(account)/_server/get-mission';
import getSession from '@/(account)/_server/get-session';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
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
        className="shadow-lg"
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

export const revalidate = 0;
export default Page;
