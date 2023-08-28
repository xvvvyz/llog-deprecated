import Tooltip from '@/(account)/_components/tooltip';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import listSubjectMissions from '@/(account)/_server/list-subject-missions';
import findActiveSession from '@/(account)/_utilities/find-active-session';
import forceArray from '@/(account)/_utilities/force-array';
import MissionLinkListItemMenu from '@/(account)/subjects/[subjectId]/timeline/@missions/_components/mission-link-list-item-menu';
import Button from '@/_components/button';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: missions }, teamId] = await Promise.all([
    getSubject(subjectId),
    listSubjectMissions(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject || !missions) return null;
  const isTeamMember = subject.team_id === teamId;

  const listItems = missions.reduce((acc, mission) => {
    const sessions = forceArray(mission.sessions);
    const activeSession = findActiveSession(sessions);
    if (!isTeamMember && !activeSession) return acc;
    const activeSessionId = activeSession?.id || '';

    acc.push(
      <li className="flex items-stretch hover:bg-alpha-1" key={mission.id}>
        <Button
          className={twMerge(
            'm-0 flex w-full gap-4 px-4 py-3 leading-snug [overflow-wrap:anywhere]',
            isTeamMember && 'pr-0',
          )}
          href={
            activeSessionId
              ? `/subjects/${subjectId}/missions/${mission.id}/sessions/${activeSessionId}`
              : `/subjects/${subjectId}/missions/${mission.id}/sessions`
          }
          variant="link"
        >
          {mission.name}
          <div className="ml-auto flex shrink-0 items-center gap-4">
            {activeSession && (
              <span className="relative top-px font-mono">
                Session {activeSession.order + 1}
              </span>
            )}
            {!isTeamMember && <ArrowRightIcon className="w-5" />}
          </div>
        </Button>
        {isTeamMember && (
          <MissionLinkListItemMenu
            missionId={mission.id}
            subjectId={subjectId}
          />
        )}
      </li>,
    );

    return acc;
  }, [] as ReactElement[]);

  if (!listItems.length && !isTeamMember) return null;

  return (
    <div className="px-4">
      {!!listItems.length && (
        <ul
          className={twMerge(
            'm-0 rounded border border-alpha-1 bg-bg-2 py-1',
            isTeamMember && 'rounded-b-none border-b-0',
          )}
        >
          {listItems}
        </ul>
      )}
      {isTeamMember && (
        <div className="flex items-center gap-4">
          <Button
            className={twMerge('w-full', listItems.length && 'rounded-t-none')}
            colorScheme="transparent"
            href={`/subjects/${subject.id}/missions/create`}
            type="button"
          >
            <PlusIcon className="w-5" />
            Create mission
          </Button>
          {!listItems.length && (
            <Tooltip
              id="missions-tip"
              tip={
                <>
                  Missions are long-term training plans. For example:
                  &ldquo;Reduce separation anxiety&rdquo; or &ldquo;Stop
                  barking&rdquo;
                </>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
