import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from 'components/button';
import { List, ListItem } from 'components/list';
import forceArray from 'utilities/force-array';
import listMissionsWithRoutines from 'utilities/list-missions-with-routines';

interface MissionProps {
  subjectId: string;
}

const Missions = async ({ subjectId }: MissionProps) => {
  const { data: missions } = await listMissionsWithRoutines(subjectId);
  if (!missions?.length) return null;

  return (
    <List>
      {missions.map((mission) => {
        const routines = forceArray(mission.routines);

        const activeSessionNumber =
          (routines.find((routine) => !routine.events.length)?.session ??
            routines.pop()?.session ??
            0) + 1;

        return (
          <ListItem key={mission.id}>
            <Button
              className="m-0 h-full w-full p-0"
              href={`/subjects/${subjectId}/mission/${mission.id}/session/${activeSessionNumber}`}
              variant="link"
            >
              <span className="w-3/4 truncate">{mission.name}</span>
              <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6 shrink-0" />
            </Button>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Missions;
