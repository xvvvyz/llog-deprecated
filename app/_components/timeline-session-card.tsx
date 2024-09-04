'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import * as Collapsible from '@/_components/collapsible';
import DateTime from '@/_components/date-time';
import EventMenu from '@/_components/event-menu';
import TimelineEventInputsTable from '@/_components/timeline-event-inputs-table';
import { ListEventsData } from '@/_queries/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import getDurationFromTimestamps from '@/_utilities/get-duration-from-timestamps';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import EventComments, {
  EventCommentsProps,
} from '@/_components/event-comments';

interface TimelineSessionCardProps {
  group: NonNullable<ListEventsData>;
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
}

const TimelineSessionCard = ({
  group,
  isArchived,
  isPublic,
  isTeamMember,
  subjectId,
}: TimelineSessionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const lastEvent = group[group.length - 1];
  const lastEventType = firstIfArray(lastEvent.type);
  const sessionNumber = (lastEventType?.session?.order ?? 0) + 1;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  const duration = getDurationFromTimestamps(
    group[0].created_at,
    group[group.length - 1].created_at,
  );

  return (
    <div className="overflow-hidden rounded border border-alpha-1 bg-bg-2 pt-1">
      <Button
        className="m-0 block p-0 px-4 py-3 hover:bg-alpha-1"
        href={`/${shareOrSubjects}/${subjectId}/training-plans/${lastEventType?.session?.training_plan?.id}/sessions/${lastEventType?.session?.id}`}
        scroll={false}
        variant="link"
      >
        <div>
          <div className="flex justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate leading-snug">
                {lastEventType?.session?.training_plan?.name}
              </div>
            </div>
            <ArrowUpRightIcon className="w-5 shrink-0" />
          </div>
          <div className="truncate text-fg-4">
            Session {sessionNumber}
            {lastEventType?.session?.title
              ? `: ${lastEventType.session.title}`
              : ''}
          </div>
        </div>
      </Button>
      <Collapsible.Root onOpenChange={setIsOpen}>
        <Collapsible.Trigger asChild>
          <Button
            colorScheme="transparent"
            className="m-0 mb-1 w-full justify-between gap-6 px-4 hover:bg-alpha-1"
            variant="link"
          >
            <div className="flex gap-2">
              <div>
                {group.length} completed module{group.length === 1 ? '' : 's'}
              </div>
              &#8226;
              <div>{duration}</div>
            </div>
            {isOpen ? (
              <ChevronUpIcon className="w-5 shrink-0" />
            ) : (
              <ChevronDownIcon className="w-5 shrink-0" />
            )}
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <ul className="divide-y divide-alpha-1 border-t border-alpha-1">
            {group.map((event) => (
              <li className="relative py-1" key={event.id}>
                <Button
                  className="m-0 block p-0 px-4 py-3 hover:bg-alpha-1"
                  href={`/${shareOrSubjects}/${subjectId}/events/${event.id}`}
                  scroll={false}
                  variant="link"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate">
                          Module {(event.type?.order ?? 0) + 1}
                          {event.type?.name ? `: ${event.type?.name}` : ''}
                        </div>
                      </div>
                      <DateTime
                        className={twMerge(
                          'smallcaps shrink-0 text-fg-4',
                          isTeamMember && 'pr-9',
                        )}
                        date={event.created_at}
                        formatter="time"
                      />
                    </div>
                    <div className="smallcaps flex w-full items-center justify-between gap-4 pb-0.5 pt-1.5 text-fg-4">
                      <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                        <div>Completed by</div>
                        <Avatar
                          className="-my-[0.15rem] size-5"
                          file={event.profile?.image_uri}
                          id={event.profile?.id}
                        />
                        <div className="min-w-0">
                          <div className="truncate">
                            {event.profile?.first_name}{' '}
                            {event.profile?.last_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!!event.inputs.length && (
                    <TimelineEventInputsTable
                      className="mt-3"
                      inputs={event.inputs}
                    />
                  )}
                  {!!event.comments.length && (
                    <div className="space-y-4 pt-4">
                      <EventComments
                        comments={
                          event.comments as EventCommentsProps['comments']
                        }
                        hideCommentTimestamp
                        isArchived={isArchived}
                        isPublic={isPublic}
                      />
                    </div>
                  )}
                </Button>
                {isTeamMember && <EventMenu eventId={event.id} />}
              </li>
            ))}
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

export default TimelineSessionCard;
