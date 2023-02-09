import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Empty from '(components)/empty';
import Header from '(components)/header';
import firstIfArray from '(utilities)/first-if-array';
import formatTitle from '(utilities)/format-title';
import getMission from '(utilities)/get-mission';
import getSubject from '(utilities)/get-subject';
import listSessionRoutines from '(utilities)/list-session-routines';
import { notFound } from 'next/navigation';
import EventCard from '../../../../../(components)/event-card';
import EditMissionLink from './(components)/edit-mission-link';
import SessionPaginator from './(components)/session-paginator';

interface PageProps {
  params: {
    missionId: string;
    sessionNumber: string;
    subjectId: string;
  };
}

const Page = async ({
  params: { missionId, sessionNumber, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }, { data: eventTypes }] =
    await Promise.all([
      getSubject(subjectId),
      getMission(missionId),
      listSessionRoutines(missionId, sessionNumber),
    ]);

  if (!subject || !mission) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  const completedRoutinesCount = eventTypes?.reduce(
    (count, { event }) => count + (firstIfArray(event) ? 1 : 0),
    0
  );

  const oneRoutineLeft =
    completedRoutinesCount === (eventTypes?.length ?? 0) - 1;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], [mission.name]]} />
      </Header>
      <main>
        {eventTypes?.length ? (
          <div className="flex flex-col gap-12 sm:gap-6">
            {/* @ts-expect-error Server Component */}
            <SessionPaginator
              missionId={missionId}
              sessionNumber={Number(sessionNumber)}
              subjectId={subjectId}
            />
            {eventTypes.map((eventType) => {
              const event = firstIfArray(eventType.event);

              return (
                <EventCard
                  event={event}
                  eventType={eventType}
                  isMission
                  key={eventType.id}
                  mission={mission}
                  redirectOnSubmit={oneRoutineLeft && !event}
                  subjectId={subjectId}
                />
              );
            })}
          </div>
        ) : (
          <Empty>
            No routines
            <EditMissionLink missionId={missionId} subjectId={subjectId} />
          </Empty>
        )}
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params: { missionId, sessionNumber, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission || !sessionNumber) return;

  return {
    title: formatTitle([
      subject.name,
      'Mission',
      mission.name,
      'Session',
      sessionNumber,
    ]),
  };
};

export default Page;
