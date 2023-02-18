'use client';

import DateTime from '(components)/date-time';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import formatDate from '(utilities)/format-date';
import { ListEventsData } from '(utilities)/list-events';
import TimelineEvent from './timeline-event';

interface TimelineEventsProps {
  events: NonNullable<ListEventsData>;
  subjectId: string;
}

const TimelineEvents = ({ events, subjectId }: TimelineEventsProps) => (
  <div className="mt-4 space-y-4" suppressHydrationWarning>
    {Object.values(
      events.reduce((acc, event) => {
        const date = formatDate(event.created_at);
        acc[date] = acc[date] ?? [];
        acc[date].push(event);
        return acc;
      }, {} as Record<string, typeof events>)
    ).map((events) => (
      <div className="space-y-4" key={events[0].created_at}>
        <DateTime
          className="ml-4 mr-2 flex h-16 items-end justify-end border-l-2 border-dashed border-alpha-2 leading-none text-fg-3"
          date={events[0].created_at}
          formatter="date"
        />
        {events.map((event) => {
          const eventType = firstIfArray(event.type);
          const comments = forceArray(event.comments);
          const profile = firstIfArray(event.profile);

          return (
            <TimelineEvent
              comments={comments}
              event={event}
              key={event.id}
              profile={profile}
              subjectId={subjectId}
              type={eventType}
            />
          );
        })}
      </div>
    ))}
  </div>
);

export default TimelineEvents;
