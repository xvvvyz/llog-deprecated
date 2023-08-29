import EventTypeLinkListItemMenu from '@/(account)/subjects/[subjectId]/timeline/@eventTypes/_components/event-type-link-list-item-menu';
import Button from '@/_components/button';
import Tooltip from '@/_components/tooltip';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getSubject from '@/_server/get-subject';
import listSubjectEventTypes from '@/_server/list-subject-event-types';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
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
      {!!eventTypes.length && (
        <ul
          className={twMerge(
            'rounded border border-alpha-1 bg-bg-2 py-1',
            isTeamMember && 'rounded-b-none border-b-0',
          )}
        >
          {eventTypes.map((eventType) => (
            <li
              className="flex items-stretch hover:bg-alpha-1"
              key={eventType.id}
            >
              <Button
                className={twMerge(
                  'm-0 flex w-full gap-4 px-4 py-3 leading-snug [overflow-wrap:anywhere]',
                  isTeamMember && 'pr-0',
                )}
                href={`/subjects/${subjectId}/event-types/${eventType.id}`}
                variant="link"
              >
                {eventType.name}
                {!isTeamMember && (
                  <ArrowRightIcon className="ml-auto w-5 shrink-0" />
                )}
              </Button>
              {isTeamMember && (
                <EventTypeLinkListItemMenu
                  eventTypeId={eventType.id}
                  subjectId={subjectId}
                />
              )}
            </li>
          ))}
        </ul>
      )}
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
