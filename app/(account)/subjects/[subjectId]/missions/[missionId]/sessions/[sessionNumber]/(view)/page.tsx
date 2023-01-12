import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Empty from 'components/empty';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import firstIfArray from 'utilities/first-if-array';
import getMission from 'utilities/get-mission';
import getSessionRoutines from 'utilities/get-session-routines';
import getSubject from 'utilities/get-subject';
import sanitizeHtml from 'utilities/sanitize-html';
import EditMissionLink from './components/edit-mission-link';
import RoutineForm from './components/routine-form';
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
  const [{ data: subject }, { data: mission }, { data: routines }] =
    await Promise.all([
      getSubject(subjectId),
      getMission(missionId),
      getSessionRoutines(missionId, sessionNumber),
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
        {/* @ts-expect-error Server Component */}
        <SessionPaginator
          missionId={missionId}
          sessionNumber={Number(sessionNumber)}
          subjectId={subjectId}
        />
      </header>
      <main>
        {routines?.length ? (
          routines.map((routine) => (
            <Card
              as="section"
              breakpoint="sm"
              className="mt-16 sm:mt-3"
              key={routine.id}
            >
              <h2 className="text-2xl">{routine.name}</h2>
              <article
                className="prose mt-9 flex flex-col gap-3"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(routine.content),
                }}
              />
              <RoutineForm
                eventId={firstIfArray(routine.event)?.id}
                routineId={routine.id}
                subjectId={subjectId}
              />
            </Card>
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

export default Page;
