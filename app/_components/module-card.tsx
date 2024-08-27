'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import * as Collapsible from '@/_components/collapsible';
import DirtyHtml from '@/_components/dirty-html';
import EventCommentForm from '@/_components/event-comment-form';
import EventForm from '@/_components/event-form';
import { GetSessionWithDetailsData } from '@/_queries/get-session-with-details';
import { GetTrainingPlanWithSessionsData } from '@/_queries/get-training-plan-with-sessions';
import forceArray from '@/_utilities/force-array';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

import DateTime from '@/_components/date-time';
import EventComments, {
  EventCommentsProps,
} from '@/_components/event-comments';
import { twMerge } from 'tailwind-merge';

interface ModuleCardProps {
  event?: NonNullable<GetSessionWithDetailsData>['modules'][0]['event'][0];
  eventType: NonNullable<GetSessionWithDetailsData>['modules'][0];
  isArchived?: boolean;
  isPreviousModulePending?: boolean;
  isPublic?: boolean;
  isTeamMember?: boolean;
  mission: NonNullable<GetTrainingPlanWithSessionsData>;
  subjectId: string;
  user?: User | null;
}

const ModuleCard = ({
  event,
  eventType,
  isArchived,
  isPreviousModulePending,
  isPublic,
  isTeamMember,
  mission,
  subjectId,
  user,
}: ModuleCardProps) => {
  const [isOpen, setIsOpen] = useState(!event && !isPreviousModulePending);
  const comments = forceArray(event?.comments);

  return (
    <Collapsible.Root onOpenChange={setIsOpen} open={isOpen}>
      <Collapsible.Trigger asChild>
        <Button
          colorScheme="transparent"
          className="m-0 block w-full px-4 hover:bg-alpha-1 sm:px-8"
          variant="link"
        >
          <div
            className={twMerge(
              'flex justify-between gap-4',
              event && 'items-baseline',
            )}
          >
            <div className="min-w-0">
              <div className="truncate leading-snug">
                Module {(eventType.order as number) + 1}
                {eventType.name ? `: ${eventType.name}` : ''}
              </div>
            </div>
            {event ? (
              <DateTime
                className="smallcaps shrink-0 text-fg-4"
                date={event.created_at}
                formatter="date-time"
              />
            ) : isOpen ? (
              <ChevronUpIcon className="mr-2 w-5 shrink-0" />
            ) : (
              <ChevronDownIcon className="mr-2 w-5 shrink-0" />
            )}
          </div>
          {event && (
            <div className="smallcaps flex items-center gap-2 whitespace-nowrap pb-0.5 pt-1">
              <div className="text-fg-4">Completed by</div>
              <Avatar
                className="-my-[0.15rem] size-5"
                file={event.profile?.image_uri}
                id={event.profile?.id}
              />
              <div className="min-w-0">
                <div className="truncate text-fg-4">
                  {event.profile?.first_name} {event.profile?.last_name}
                </div>
              </div>
              {isOpen ? (
                <ChevronUpIcon className="ml-auto mr-2 w-5 shrink-0" />
              ) : (
                <ChevronDownIcon className="ml-auto mr-2 w-5 shrink-0" />
              )}
            </div>
          )}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="space-y-16 pb-8 pt-10">
        {eventType.content && (
          <DirtyHtml className="px-4 sm:px-8">{eventType.content}</DirtyHtml>
        )}
        {(event || (!isPublic && !isArchived)) && (
          <EventForm
            event={event}
            eventType={eventType}
            isArchived={isArchived}
            isMission={!!mission}
            isPreviousModulePending={isPreviousModulePending}
            isPublic={isPublic}
            subjectId={subjectId}
          />
        )}
        {event && (!!comments.length || (!isPublic && !isArchived)) && (
          <div className="flex flex-col gap-8 px-4 sm:px-8">
            <EventComments
              comments={comments as EventCommentsProps['comments']}
              isArchived={isArchived}
              isPublic={isPublic}
              isTeamMember={isTeamMember}
              userId={user?.id}
            />
            {!isPublic && !isArchived && (
              <EventCommentForm eventId={event.id} />
            )}
          </div>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default ModuleCard;
