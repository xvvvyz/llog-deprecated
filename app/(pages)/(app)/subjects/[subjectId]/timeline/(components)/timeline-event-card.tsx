'use client';

import Avatar from '(components)/avatar';
import DateTime from '(components)/date-time';
import Pill from '(components)/pill';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import { ListEventsData } from '(utilities)/list-events';
import { useRouter } from 'next/navigation';
import EventCommentForm from '../../(components)/event-comment-form';
import EventComments from '../../(components)/event-comments';
import EventInputs from '../../(components)/event-inputs';

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
  const router = useRouter();
  const lastEvent = group[group.length - 1];
  const lastEventType = firstIfArray(lastEvent.type);
  const sessionNumber = lastEventType.session?.order + 1;

  const link = lastEventType.session
    ? `/subjects/${subjectId}/mission/${lastEventType.session.mission.id}/session/${lastEventType.session.id}`
    : `/subjects/${subjectId}/event/${lastEvent.id}`;

  return (
    <article
      className="group cursor-pointer select-none overflow-hidden rounded border border-alpha-1 bg-bg-2 transition-colors hover:border-alpha-4"
      data-href={link}
      onClick={() => router.push(link)}
      onMouseOver={() => router.prefetch(link)}
      onTouchStart={() => router.prefetch(link)}
      role="link"
    >
      <header className="flex w-full items-center gap-4 rounded-t bg-alpha-reverse-1 px-4 py-3">
        <div className="flex w-0 flex-1 items-baseline gap-4">
          <span className="truncate">
            {lastEventType.session
              ? lastEventType.session.mission.name
              : lastEventType.name}
          </span>
        </div>
        {lastEventType.session ? (
          <Pill>Session {sessionNumber}</Pill>
        ) : (
          <div className="flex items-center gap-4 whitespace-nowrap">
            <Avatar
              name={firstIfArray(lastEvent.profile).first_name}
              size="xs"
            />
            <DateTime
              className="text-xs uppercase tracking-widest text-fg-3"
              date={lastEvent.created_at}
              formatter="time"
            />
          </div>
        )}
      </header>
      <ul>
        {group.map((event) => {
          const routineNumber = firstIfArray(event.type).order + 1;
          const comments = forceArray(event.comments);

          return (
            <li key={event.id}>
              {lastEventType.session && (
                <div className="flex items-center justify-between border-t border-alpha-1 bg-alpha-reverse-1 px-4 pb-2 pt-3 text-xs uppercase tracking-widest text-fg-3">
                  <span>Routine {routineNumber}</span>
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={firstIfArray(event.profile).first_name}
                      size="xs"
                    />
                    <DateTime date={event.created_at} formatter="time" />
                  </div>
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
