import Button from '@/_components/button';
import TrainingPlanMenu from '@/_components/training-plan-menu';
import listSubjectTrainingPlans from '@/_queries/list-subject-training-plans';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface MissionsProps {
  isTeamMember: boolean;
  subjectId: string;
}

const TrainingPlans = async ({ isTeamMember, subjectId }: MissionsProps) => {
  const { data: missions } = await listSubjectTrainingPlans(subjectId);
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
          <TrainingPlanMenu missionId={mission.id} subjectId={subjectId} />
        )}
      </li>,
    );

    return acc;
  }, [] as ReactElement[]);

  if (!listItems.length) return null;

  return (
    <ul className="m-0 rounded border border-alpha-1 bg-bg-2 py-1">
      {listItems}
    </ul>
  );
};

export default TrainingPlans;
