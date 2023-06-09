'use client';

import Avatar from '@/(account)/_components/avatar';
import DateTime from '@/(account)/_components/date-time';
import Pill from '@/(account)/_components/pill';
import { ListEventsData } from '@/(account)/_server/list-events';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import EventCommentForm from '@/(account)/subjects/[subjectId]/_components/event-comment-form';
import EventComments from '@/(account)/subjects/[subjectId]/_components/event-comments';
import EventInputs from '@/(account)/subjects/[subjectId]/_components/event-inputs';
import Button from '@/_components/button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface TimelineEventCardProps {
  group: ListEventsData;
  subjectId: string;
  userId: string;
}

const TimelineEventCard = ({
  group,
  subjectId,
  userId,
}: TimelineEventCardProps) => {
  const lastEvent = group[group.length - 1];
  const lastEventType = firstIfArray(lastEvent.type);
  const lastEventProfile = firstIfArray(lastEvent.profile);
  const sessionNumber = lastEventType.session?.order + 1;

  return (
    <article className="overflow-hidden rounded border border-alpha-1 bg-bg-2">
      <Button
        className="m-0 block w-full items-start rounded-t bg-alpha-reverse-1 p-0 px-4 py-3"
        href={
          lastEventType.session
            ? `/subjects/${subjectId}/mission/${lastEventType.session.mission.id}/session/${lastEventType.session.id}`
            : `/subjects/${subjectId}/event/${lastEvent.id}`
        }
        variant="link"
      >
        <div className="flex items-center gap-4">
          <div>
            {lastEventType.session
              ? lastEventType.session.mission.name
              : lastEventType.name}
          </div>
          {lastEventType.session && <Pill>Session {sessionNumber}</Pill>}
          <ArrowRightIcon className="ml-auto w-5 shrink-0" />
        </div>
        {!lastEventType.session && (
          <div className="mt-3 flex items-center gap-4 whitespace-nowrap text-xs uppercase tracking-widest text-fg-3">
            <Avatar name={lastEventProfile.first_name} size="xs" />
            {lastEventProfile.first_name} {lastEventProfile.last_name}
            <DateTime
              className="ml-auto"
              date={lastEvent.created_at}
              formatter="time"
            />
          </div>
        )}
      </Button>
      <ul>
        {group.map((event) => {
          const routineNumber = firstIfArray(event.type).order + 1;
          const comments = forceArray(event.comments);

          return (
            <li key={event.id}>
              {lastEventType.session && (
                <div className="flex items-center justify-between border-t border-alpha-1 bg-alpha-reverse-1 px-4 pb-2 pt-3 text-xs uppercase tracking-widest text-fg-3">
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={firstIfArray(event.profile).first_name}
                      size="xs"
                    />
                    Completed routine {routineNumber}
                  </div>
                  <DateTime date={event.created_at} formatter="time" />
                </div>
              )}
              <EventInputs inputs={forceArray(event.inputs)} />
              {!!comments.length && (
                <div className="space-y-4 border-t border-alpha-1 p-4">
                  <EventComments comments={comments} userId={userId} />
                  <EventCommentForm
                    eventId={event.id}
                    inputClassName="rounded-sm"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
};

export default TimelineEventCard;
