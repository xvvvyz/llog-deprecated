'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import EventMenu from '@/_components/event-menu';
import TimelineEventInputsTable from '@/_components/timeline-event-inputs-table';
import { ListEventsData } from '@/_queries/list-events';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { twMerge } from 'tailwind-merge';

import EventComments, {
  EventCommentsProps,
} from '@/_components/event-comments';

interface TimelineEventCardProps {
  event: NonNullable<ListEventsData>[0];
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
}

const TimelineEventCard = ({
  event,
  isArchived,
  isPublic,
  isTeamMember,
  subjectId,
}: TimelineEventCardProps) => {
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <div className="relative overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1">
      <Button
        className="m-0 block p-0 px-4 py-3 hover:bg-alpha-1 active:bg-alpha-1"
        href={`/${shareOrSubjects}/${subjectId}/events/${event.id}`}
        scroll={false}
        variant="link"
      >
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate leading-snug">{event.type?.name}</div>
            </div>
            <div className="smallcaps flex shrink-0 gap-4 whitespace-nowrap">
              <DateTime
                className="text-fg-4"
                date={event.created_at}
                formatter="time"
              />
              <ArrowUpRightIcon
                className={twMerge('-mt-0.5 w-5', isTeamMember && 'invisible')}
              />
            </div>
          </div>
          <div className="smallcaps flex w-full items-center justify-between gap-4 pb-0.5 pt-1 text-fg-4">
            <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
              <div>Recorded by</div>
              <Avatar
                className="-my-[0.15rem] size-5"
                file={event.profile?.image_uri}
                id={event.profile?.id}
              />
              <div className="min-w-0">
                <div className="truncate">
                  {event.profile?.first_name} {event.profile?.last_name}
                </div>
              </div>
            </div>
          </div>
        </div>
        {!!event.inputs.length && (
          <TimelineEventInputsTable className="mt-3" inputs={event.inputs} />
        )}
        {!!event.comments.length && (
          <div className="space-y-4 pt-4">
            <EventComments
              comments={event.comments as EventCommentsProps['comments']}
              hideCommentTimestamp
              isArchived={isArchived}
              isPublic={isPublic}
              limit={1}
            />
          </div>
        )}
      </Button>
      {isTeamMember && <EventMenu eventId={event.id} />}
    </div>
  );
};

export default TimelineEventCard;
