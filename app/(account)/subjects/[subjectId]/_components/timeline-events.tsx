'use client';

import DateTime from '@/_components/date-time';
import { ListEventsData } from '@/_server/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import formatDate from '@/_utilities/format-date';
import { User } from '@supabase/gotrue-js';
import { useEffect, useState } from 'react';
import TimelineEventCard from './timeline-event-card';

interface TimelineEventsProps {
  events: ListEventsData;
  isTeamMember: boolean;
  subjectId: string;
  user: User;
}

const TimelineEvents = ({
  events,
  isTeamMember,
  subjectId,
  user,
}: TimelineEventsProps) => {
  const [formattedEvents, setFormattedEvents] = useState<
    Array<Map<string, ListEventsData>>
  >([]);

  useEffect(() => {
    setFormattedEvents(
      Object.values(
        events.reduce(
          (acc, event) => {
            const date = formatDate(event.created_at);
            acc[date] = acc[date] ?? new Map();
            const type = firstIfArray(event.type);
            const key = type.session?.id ?? event.id;
            const keyEvents = (acc[date].get(key) ?? []) as ListEventsData;
            keyEvents.unshift(event);
            acc[date].set(key, keyEvents);
            return acc;
          },
          {} as Record<string, Map<string, ListEventsData>>,
        ),
      ),
    );
  }, [events]);

  return formattedEvents.map((groups) => {
    const dayGroup = Array.from(groups.values());
    const firstEvent = dayGroup[0][0];

    return (
      <div className="space-y-4" key={firstEvent.created_at}>
        <DateTime
          className="smallcaps mx-4 flex h-14 items-end justify-end border-l-2 border-dashed border-alpha-2"
          date={firstEvent.created_at}
          formatter="date"
        />
        {dayGroup.map((eventGroup) => (
          <TimelineEventCard
            group={eventGroup}
            isTeamMember={isTeamMember}
            key={eventGroup[0].id}
            subjectId={subjectId}
            user={user}
          />
        ))}
      </div>
    );
  });
};

export default TimelineEvents;
