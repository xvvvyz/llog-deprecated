import LinkList from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import forceArray from '(utilities)/force-array';
import listMissionsWithRoutines from '(utilities)/list-missions-with-routines';

interface MissionProps {
  isTeamMember: boolean;
  subjectId: string;
}

const Missions = async ({ isTeamMember, subjectId }: MissionProps) => {
  const { data: missions } = await listMissionsWithRoutines(subjectId);

  return (
    <LinkList>
      {forceArray(missions).reduce((acc, mission) => {
        const routines = forceArray(mission.routines);
        const activeRoutine = routines.find(({ events }) => !events.length);
        if (!activeRoutine) return acc;
        const activeSessionNumber = activeRoutine.session + 1;

        acc.push(
          <LinkList.Item
            href={`/subjects/${subjectId}/mission/${mission.id}/session/${activeSessionNumber}`}
            key={mission.id}
            pill={CODES.mission}
            text={mission.name}
            {...(isTeamMember
              ? {
                  rightHref: `/subjects/${subjectId}/settings/mission/${mission.id}?back=/subjects/${subjectId}`,
                  rightIcon: 'edit',
                  rightLabel: 'Edit',
                }
              : {})}
          />
        );

        return acc;
      }, [])}
    </LinkList>
  );
};

export default Missions;
