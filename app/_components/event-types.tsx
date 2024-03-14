import Button from '@/_components/button';
import EventTypeLinkListItemMenu from '@/_components/event-type-link-list-item-menu';
import Tooltip from '@/_components/tooltip';
import listSubjectEventTypes from '@/_queries/list-subject-event-types';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { twMerge } from 'tailwind-merge';

interface EventTypesProps {
  isTeamMember: boolean;
  subjectId: string;
}

const EventTypes = async ({ isTeamMember, subjectId }: EventTypesProps) => {
  const { data: eventTypes } = await listSubjectEventTypes(subjectId);
  if (!eventTypes) return null;

  return (
    <div>
      {isTeamMember && (
        <div className="mb-4 flex items-center gap-4">
          <Button
            className="w-full"
            colorScheme="transparent"
            href={`/subjects/${subjectId}/event-types/create`}
            scroll={false}
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
                  Event types define the events that can be recorded at any
                  time. For example: &ldquo;Barking&rdquo; or &ldquo;Vet
                  visit&rdquo;
                </>
              }
            />
          )}
        </div>
      )}
      {!!eventTypes.length && (
        <ul className="rounded border border-alpha-1 bg-bg-2 py-1">
          {eventTypes.map((eventType) => (
            <li
              className="flex items-stretch hover:bg-alpha-1"
              key={eventType.id}
            >
              <Button
                className={twMerge(
                  'm-0 flex w-full gap-4 px-4 py-3 leading-snug',
                  isTeamMember && 'pr-0',
                )}
                href={`/subjects/${subjectId}/event-types/${eventType.id}`}
                scroll={false}
                variant="link"
              >
                {eventType.name}
                {!isTeamMember && (
                  <ArrowUpRightIcon className="ml-auto w-5 shrink-0" />
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
    </div>
  );
};

export default EventTypes;
