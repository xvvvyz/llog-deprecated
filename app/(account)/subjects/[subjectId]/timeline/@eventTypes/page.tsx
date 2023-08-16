import LinkList from '@/(account)/_components/link-list';
import Tooltip from '@/(account)/_components/tooltip';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import listSubjectEventTypes from '@/(account)/_server/list-subject-event-types';
import Button from '@/_components/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventTypes }, teamId] = await Promise.all([
    getSubject(subjectId),
    listSubjectEventTypes(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject || !eventTypes) return null;
  const isTeamMember = subject.team_id === teamId;
  if (!eventTypes.length && !isTeamMember) return null;

  return (
    <div className="px-4">
      <LinkList
        className={twMerge('m-0', isTeamMember && 'rounded-b-none border-b-0')}
      >
        {eventTypes.map((eventType) => (
          <LinkList.Item
            href={`/subjects/${subjectId}/event-types/${eventType.id}`}
            key={eventType.id}
            text={eventType.name as string}
            {...(isTeamMember
              ? {
                  rightHref: `/subjects/${subjectId}/event-types/${eventType.id}/edit`,
                  rightIcon: 'edit',
                  rightLabel: 'Edit',
                }
              : {})}
          />
        ))}
      </LinkList>
      {isTeamMember && (
        <div className="flex items-center gap-4">
          <Button
            className={twMerge('w-full', eventTypes.length && 'rounded-t-none')}
            colorScheme="transparent"
            href={`/subjects/${subject.id}/event-types/create`}
            type="button"
          >
            <PlusIcon className="w-5" />
            Create event type
          </Button>
          {!eventTypes.length && (
            <Tooltip
              id="event-types-tip"
              tip={
                <>
                  Event types define individual events that can be recorded. For
                  example: &ldquo;Barking&rdquo; or &ldquo;Vet visit&rdquo;
                </>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
