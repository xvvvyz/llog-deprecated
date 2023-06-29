'use client';

import DateTime from '@/(account)/_components/date-time';
import { ListEventsData } from '@/(account)/_server/list-events';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import formatDate from '@/(account)/_utilities/format-date';
import { useEffect, useState } from 'react';
import TimelineEventCard from './timeline-event-card';

interface TimelineEventsProps {
  events: ListEventsData;
  isTeamMember: boolean;
  subjectId: string;
  userId: string;
}

const TimelineEvents = ({
  events,
  isTeamMember,
  subjectId,
  userId,
}: TimelineEventsProps) => {
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
    <div className="space-y-4 px-4">
      {formattedEvents.map((groups) => {
        const dayGroup = Array.from(groups.values());
        const firstEvent = dayGroup[0][0];

        return (
          <div className="space-y-4" key={firstEvent.created_at}>
            <DateTime
              className="smallcaps mx-4 flex h-16 items-end justify-end border-l-2 border-dashed border-alpha-2"
              date={firstEvent.created_at}
              formatter="date"
            />
            {dayGroup.map((eventGroup) => (
              <TimelineEventCard
                group={eventGroup}
                isTeamMember={isTeamMember}
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
