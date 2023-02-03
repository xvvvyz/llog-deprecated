import { ListItem } from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import forceArray from '(utilities)/force-array';
import listMissionsWithRoutines from '(utilities)/list-missions-with-routines';

interface MissionProps {
  subjectId: string;
}

const Missions = async ({ subjectId }: MissionProps) => {
  const { data: missions } = await listMissionsWithRoutines(subjectId);
  if (!missions?.length) return null;

  return missions.map((mission) => {
    const routines = forceArray(mission.routines);
    const lastSessionIndex = routines.pop()?.session;

    const activeSessionIndex =
      routines.find((routine) => !routine.events.length)?.session ??
      lastSessionIndex ??
      0;

    const activeSessionNumber = activeSessionIndex + 1;

    return (
      <ListItem
        href={`/subjects/${subjectId}/mission/${mission.id}/session/${activeSessionNumber}`}
        key={mission.id}
        pill={CODES.mission}
        text={mission.name}
      />
    );
  });
};

export default Missions;
