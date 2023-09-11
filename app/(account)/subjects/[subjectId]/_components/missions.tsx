import MissionLinkListItemMenu from '@/(account)/subjects/[subjectId]/_components/mission-link-list-item-menu';
import Button from '@/_components/button';
import Tooltip from '@/_components/tooltip';
import listSubjectMissions from '@/_server/list-subject-missions';
import { Database } from '@/_types/database';
import forceArray from '@/_utilities/force-array';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
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
    const sessions = forceArray(mission.sessions);

    const activeSession = sessions.find(({ modules }) =>
      modules.find(
        (et: { event: Database['public']['Tables']['events']['Row'][] }) =>
          !et.event.length,
      ),
    );

    if (!isTeamMember && !activeSession) return acc;
    const activeSessionId = activeSession?.id || '';

    acc.push(
      <li className="flex items-stretch hover:bg-alpha-1" key={mission.id}>
        <Button
          className={twMerge(
            'm-0 w-full items-baseline gap-4 px-4 py-3 leading-snug',
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
    <div>
      {!!listItems.length && (
        <ul className="m-0 rounded border border-alpha-1 bg-bg-2 py-1">
          {listItems}
        </ul>
      )}
      {isTeamMember && (
        <div className="mt-4 flex items-center gap-4">
          <Button
            className="w-full"
            colorScheme="transparent"
            href={`/subjects/${subjectId}/missions/create`}
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

export default Missions;
