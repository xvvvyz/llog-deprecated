'use client';

import DateTime from '(components)/date-time';
import firstIfArray from '(utilities)/first-if-array';
import formatDate from '(utilities)/format-date';
import { ListEventsData } from '(utilities)/list-events';
import { useEffect, useState } from 'react';
import TimelineEventCard from './timeline-event-card';

interface TimelineEventsProps {
  events: ListEventsData;
  subjectId: string;
  userId: string;
}

const TimelineEvents = ({ events, subjectId, userId }: TimelineEventsProps) => {
  const [formattedEvents, setFormattedEvents] = useState<
    Array<Map<string, ListEventsData>>
  >([]);

  useEffect(() => {
    setFormattedEvents(
      Object.values(
        events.reduce((acc, event) => {
          const date = formatDate(event.created_at);
          acc[date] = acc[date] ?? new Map();
          const type = firstIfArray(event.type);
          const key = type.session?.id ?? event.id;
          const keyEvents = (acc[date].get(key) ?? []) as ListEventsData;
          keyEvents.unshift(event);
          acc[date].set(key, keyEvents);
          return acc;
        }, {} as Record<string, Map<string, ListEventsData>>)
      )
    );
  }, [events]);

  return (
    <div className="space-y-4">
      {formattedEvents.map((groups) => {
        const dayGroup = Array.from(groups.values());
        const firstEvent = dayGroup[0][0];

        return (
          <div className="space-y-4" key={firstEvent.created_at}>
            <DateTime
              className="ml-4 mr-2 flex h-16 items-end justify-end border-l-2 border-dashed border-alpha-2 leading-none text-fg-3"
              date={firstEvent.created_at}
              formatter="date"
            />
            {dayGroup.map((eventGroup) => (
              <TimelineEventCard
                group={eventGroup}
                key={eventGroup[0].id}
                subjectId={subjectId}
                userId={userId}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineEvents;
