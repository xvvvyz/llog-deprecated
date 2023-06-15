import LinkList from '@/(account)/_components/link-list';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import listSubjectMissions from '@/(account)/_server/list-subject-missions';
import forceArray from '@/(account)/_utilities/force-array';
import Button from '@/_components/button';
import { Database } from '@/_types/database';
import { PlusIcon } from '@heroicons/react/24/outline';
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

    const activeSession = sessions.find(({ modules }) =>
      modules.find(
        (et: { events: Database['public']['Tables']['events']['Row'][] }) =>
          !et.events.length
      )
    );

    if (!isTeamMember && !activeSession) return acc;
    const editHref = `/subjects/${subjectId}/missions/${mission.id}/edit`;

    acc.push(
      <LinkList.Item
        href={
          isTeamMember && !activeSession
            ? editHref
            : `/subjects/${subjectId}/missions/${mission.id}/sessions/${activeSession.id}`
        }
        icon={isTeamMember && !activeSession ? 'edit' : 'arrow'}
        key={mission.id}
        text={mission.name}
        {...(isTeamMember && activeSession
          ? { rightHref: editHref, rightIcon: 'edit', rightLabel: 'Edit' }
          : {})}
      />
    );

    return acc;
  }, [] as ReactElement[]);

  if (!listItems.length && !isTeamMember) return null;

  return (
    <div className="px-4">
      <LinkList
        className={twMerge('m-0', isTeamMember && 'rounded-b-none border-b-0')}
      >
        {listItems}
      </LinkList>
      {isTeamMember && (
        <Button
          className={twMerge('w-full', !!listItems.length && 'rounded-t-none')}
          colorScheme="transparent"
          href={`/subjects/${subject.id}/missions/create`}
          type="button"
        >
          <PlusIcon className="w-5" />
          Create mission
        </Button>
      )}
    </div>
  );
};

export default Page;
