import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import getCurrentUser from '(utilities)/get-current-user';
import getMission from '(utilities)/get-mission';
import getSession from '(utilities)/get-session';
import { notFound } from 'next/navigation';
import EventCard from '../../../../../../(components)/event-card';

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

  if (!mission || !session || !user) return notFound();

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
