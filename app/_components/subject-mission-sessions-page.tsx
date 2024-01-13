import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getPublicMissionWithSessionsAndEvents from '@/_server/get-public-mission-with-sessions-and-events';
import getPublicSubject from '@/_server/get-public-subject';
import getSubject from '@/_server/get-subject';
import forceArray from '@/_utilities/force-array';

import {
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import getMissionWithSessionsAndEvents, {
  GetMissionWithSessionsAndEventsData,
} from '@/_server/get-mission-with-sessions-and-events';
import { notFound } from 'next/navigation';

interface SubjectMissionSessionsPageProps {
  isPublic?: boolean;
  missionId: string;
  subjectId: string;
}

const SubjectMissionSessionsPage = async ({
  isPublic,
  missionId,
  subjectId,
}: SubjectMissionSessionsPageProps) => {
  const [{ data: subject }, teamId] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject) notFound();
  const isTeamMember = !!teamId && subject.team_id === teamId;

  const { data: mission } = isPublic
    ? await getPublicMissionWithSessionsAndEvents(missionId)
    : await getMissionWithSessionsAndEvents(missionId, { draft: isTeamMember });

  if (!mission) notFound();
  const sessions = forceArray(mission.sessions);

  const { highestOrder, sessionsReversed } = sessions.reduce(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session.order);
      acc.sessionsReversed.push(sessions[sessions.length - i - 1]);
      return acc;
    },
    { highestOrder: -1, sessionsReversed: [] },
  );

  const nextSessionOrder = highestOrder + 1;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href={`/${shareOrSubjects}/${subjectId}`} />
        <Breadcrumbs
          className="text-center"
          items={[
            [subject.name, `/${shareOrSubjects}/${subjectId}`],
            [mission.name],
          ]}
        />
      </div>
      {isTeamMember && (
        <div className="-mt-3 mb-16 flex h-8 items-center justify-between gap-8 px-4">
          <h1 className="text-2xl">Sessions</h1>
          <Button
            href={`/subjects/${subjectId}/missions/${missionId}/sessions/create/${nextSessionOrder}`}
            size="sm"
          >
            Add session
          </Button>
        </div>
      )}
      {sessionsReversed.length ? (
        <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
          {sessionsReversed.map(
            (
              session: NonNullable<GetMissionWithSessionsAndEventsData>['sessions'][0],
            ) => {
              const modules = forceArray(session.modules);
              const completedModules = modules.filter((m) => m.event.length);

              return (
                <li key={session.id}>
                  <Button
                    className="m-0 w-full gap-6 px-4 py-3 leading-snug hover:bg-alpha-1"
                    href={
                      isTeamMember
                        ? `/subjects/${subjectId}/missions/${missionId}/sessions/${session.id}/edit`
                        : `/${shareOrSubjects}/${subjectId}/missions/${missionId}/sessions/${session.id}`
                    }
                    variant="link"
                  >
                    <div>
                      <span className="font-mono">
                        Session {session.order + 1}
                      </span>
                      {session.title && (
                        <span className="before:px-3 before:text-alpha-4 before:content-['/']">
                          {session.title}
                        </span>
                      )}
                      <div className="smallcaps pb-0.5 pt-1">
                        {session.draft ? (
                          'Draft'
                        ) : new Date(session.scheduled_for ?? '') >
                          new Date() ? (
                          <DateTime
                            date={session.scheduled_for ?? ''}
                            formatter="date"
                          />
                        ) : completedModules.length ? (
                          `${completedModules.length} of ${modules.length} completed`
                        ) : (
                          'Not started'
                        )}
                      </div>
                    </div>
                    <ArrowRightIcon className="ml-auto w-5 shrink-0" />
                  </Button>
                </li>
              );
            },
          )}
        </ul>
      ) : (
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Schedule detailed training sessions
          <br />
          to be completed over time.
        </Empty>
      )}
    </>
  );
};

export default SubjectMissionSessionsPage;
