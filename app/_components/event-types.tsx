import Button from '@/_components/button';
import EventTypeMenu from '@/_components/event-type-menu';
import { ListEventTypesData } from '@/_queries/list-event-types';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { twMerge } from 'tailwind-merge';

interface EventTypesProps {
  isTeamMember: boolean;
  eventTypes: NonNullable<ListEventTypesData>;
  subjectId: string;
}

const EventTypes = ({
  isTeamMember,
  eventTypes,
  subjectId,
}: EventTypesProps) => (
  <ul className="overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1">
    {eventTypes.map((eventType) => (
      <li
        className="flex items-stretch transition-colors hover:bg-alpha-1"
        key={eventType.id}
      >
        <Button
          className={twMerge(
            'm-0 flex w-full gap-4 px-4 py-3 leading-snug',
            isTeamMember && 'pr-0',
          )}
          href={`/subjects/${subjectId}/event-types/${eventType.id}`}
          variant="link"
        >
          {eventType.name}
          {!isTeamMember && <PlusIcon className="ml-auto w-5 shrink-0" />}
        </Button>
        {isTeamMember && (
          <EventTypeMenu eventTypeId={eventType.id} subjectId={subjectId} />
        )}
      </li>
    ))}
  </ul>
);

export default EventTypes;
