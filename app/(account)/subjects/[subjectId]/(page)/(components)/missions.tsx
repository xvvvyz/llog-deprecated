import LinkList from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import forceArray from '(utilities)/force-array';
import listMissionsWithRoutines from '(utilities)/list-missions-with-routines';

interface MissionProps {
  subjectId: string;
}

const Missions = async ({ subjectId }: MissionProps) => {
  const { data: missions } = await listMissionsWithRoutines(subjectId);

  return forceArray(missions).reduce((acc, mission) => {
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
      />
    );
  }, []);
};

export default Missions;
