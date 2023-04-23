import LinkList from '(components)/link-list';
import { Database } from '(types)/database';
import CODES from '(utilities)/constant-codes';
import forceArray from '(utilities)/force-array';
import listMissions from '(utilities)/list-missions';

interface MissionProps {
  isTeamMember: boolean;
  subjectId: string;
}

const Missions = async ({ isTeamMember, subjectId }: MissionProps) => {
  const { data: missions } = await listMissions(subjectId);

  return (
    <LinkList>
      {forceArray(missions).reduce((acc, mission) => {
        const sessions = forceArray(mission.sessions);

        const activeSession = sessions.find(({ routines }) =>
          routines.find(
            (et: { events: Database['public']['Tables']['events']['Row'][] }) =>
              !et.events.length
          )
        );

        if (!activeSession) return acc;

        acc.push(
          <LinkList.Item
            href={`/subjects/${subjectId}/mission/${mission.id}/session/${activeSession.id}`}
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
