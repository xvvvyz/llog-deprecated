import EventCard from '(account)/subjects/[subjectId]/components/event-card';
import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Empty from 'components/empty';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import firstIfArray from 'utilities/first-if-array';
import getMission from 'utilities/get-mission';
import getSubject from 'utilities/get-subject';
import listSessionRoutines from 'utilities/list-session-routines';
import EditMissionLink from './components/edit-mission-link';
import SessionPaginator from './components/session-paginator';

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

  return (
    <>
      <header>
        <Header as="div">
          <BackButton href={subjectHref} />
          <Breadcrumbs items={[[subject.name, subjectHref], [mission.name]]} />
        </Header>
        <Header as="div" className="m-0">
          {/* @ts-expect-error Server Component */}
          <SessionPaginator
            missionId={missionId}
            sessionNumber={Number(sessionNumber)}
            subjectId={subjectId}
          />
        </Header>
      </header>
      <main className="mt-12 flex flex-col gap-12 sm:gap-3">
        {eventTypes?.length ? (
          eventTypes.map((eventType) => (
            <EventCard
              event={firstIfArray(eventType.event)}
              eventType={eventType}
              key={eventType.id}
              subjectId={subjectId}
            />
          ))
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
export default Page;
