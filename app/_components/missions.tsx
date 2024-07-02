import Button from '@/_components/button';
import MissionMenu from '@/_components/mission-menu';
import Tip from '@/_components/tip';
import listSubjectMissions from '@/_queries/list-subject-missions';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface MissionsProps {
  isTeamMember: boolean;
  subjectId: string;
}

const Missions = async ({ isTeamMember, subjectId }: MissionsProps) => {
  const { data: missions } = await listSubjectMissions(subjectId);
  if (!missions) return null;

  const listItems = missions.reduce((acc, mission) => {
    const activeSession = mission.sessions.find(({ modules }) =>
      modules.find((et) => !et.event.length),
    );

    if (!isTeamMember && !activeSession) return acc;
    const activeSessionId = activeSession?.id || '';

    acc.push(
      <li
        className="flex items-stretch hover:bg-alpha-1 active:bg-alpha-1"
        key={mission.id}
      >
        <Button
          className={twMerge(
            'm-0 w-full items-baseline gap-4 px-4 py-3 leading-snug',
            isTeamMember && 'pr-0',
          )}
          href={
            isTeamMember
              ? `/subjects/${subjectId}/training-plans/${mission.id}/sessions`
              : `/subjects/${subjectId}/training-plans/${mission.id}/sessions/${activeSessionId}`
          }
          scroll={false}
          variant="link"
        >
          {mission.name}
          {!isTeamMember && (
            <div className="ml-auto flex shrink-0 items-center gap-4">
              {activeSession && (
                <span className="smallcaps text-fg-4">
                  Session {activeSession.order + 1}
                </span>
              )}
              {!isTeamMember && <ArrowUpRightIcon className="w-5" />}
            </div>
          )}
        </Button>
        {isTeamMember && (
          <MissionMenu missionId={mission.id} subjectId={subjectId} />
        )}
      </li>,
    );

    return acc;
  }, [] as ReactElement[]);

  if (!listItems.length && !isTeamMember) return null;

  return (
    <div>
      {isTeamMember && (
        <div className="mb-4 flex items-center gap-4">
          <Button
            className="w-full"
            colorScheme="transparent"
            href={`/subjects/${subjectId}/training-plans/create`}
            scroll={false}
          >
            <PlusIcon className="w-5" />
            Create training plan
          </Button>
          {!listItems.length && (
            <Tip>
              Training plans are comprised of sessions to be completed over
              time. For example: &ldquo;Reduce separation anxiety&rdquo; or
              &ldquo;Stop screaming&rdquo;
            </Tip>
          )}
        </div>
      )}
      {!!listItems.length && (
        <ul className="m-0 rounded border border-alpha-1 bg-bg-2 py-1">
          {listItems}
        </ul>
      )}
    </div>
  );
};

export default Missions;
