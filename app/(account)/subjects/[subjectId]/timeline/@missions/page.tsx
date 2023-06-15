import LinkList from '@/(account)/_components/link-list';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import listMissions from '@/(account)/_server/list-missions';
import forceArray from '@/(account)/_utilities/force-array';
import { Database } from '@/_types/database';
import { ReactElement } from 'react';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: missions }, teamId] = await Promise.all([
    getSubject(subjectId),
    listMissions(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject) return null;

  const listItems = forceArray(missions).reduce((acc, mission) => {
    const sessions = forceArray(mission.sessions);

    const activeSession = sessions.find(({ parts }) =>
      parts.find(
        (et: { events: Database['public']['Tables']['events']['Row'][] }) =>
          !et.events.length
      )
    );

    if (!activeSession) return acc;

    acc.push(
      <LinkList.Item
        href={`/subjects/${subjectId}/mission/${mission.id}/session/${activeSession.id}`}
        key={mission.id}
        text={mission.name}
        {...(subject.team_id === teamId
          ? {
              rightHref: `/subjects/${subjectId}/settings/mission/${mission.id}?back=/subjects/${subjectId}`,
              rightIcon: 'edit',
              rightLabel: 'Edit',
            }
          : {})}
      />
    );

    return acc;
  }, [] as ReactElement[]);

  if (!listItems.length) return null;
  return <LinkList>{listItems}</LinkList>;
};

export default Page;
