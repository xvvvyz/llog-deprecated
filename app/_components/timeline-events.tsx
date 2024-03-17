'use client';

import listEvents from '@/_actions/list-events';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import { ListEventsData } from '@/_queries/list-events';
import formatTimelineEvents from '@/_utilities/format-timeline-events';
import { User } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import TimelineEventCard from './timeline-event-card';

interface TimelineEventsProps {
  events: NonNullable<ListEventsData>;
  isPublic?: boolean;
  isTeamMember: boolean;
  pageSize: number;
  subjectId: string;
  to: number;
  user?: User;
}

const TimelineEvents = ({
  events,
  isPublic,
  isTeamMember,
  pageSize,
  subjectId,
  to,
  user,
}: TimelineEventsProps) => {
  const [eventsState, setEventsState] = useState<typeof events>([]);
  const [hasMore, setHasMore] = useState(events.length - 1 === to);
  const [isTransitioning, startTransition] = useTransition();
  const formattedEvents = formatTimelineEvents(eventsState);
  const searchParams = useSearchParams();

  useEffect(() => {
    setEventsState(events);
  }, [events, setEventsState]);

  return (
    <>
      {formattedEvents.map((groups) => {
        const dayGroup = Array.from(
          groups.values(),
        ) as NonNullable<ListEventsData>[];

        const firstEvent = dayGroup[0][0];

        return (
          <div className="mt-4 space-y-4" key={firstEvent.created_at}>
            <DateTime
              className="smallcaps mx-4 flex h-14 items-end justify-end border-l-2 border-dashed border-alpha-2 text-fg-4"
              date={firstEvent.created_at}
              formatter="date"
            />
            {dayGroup.map((eventGroup) => (
              <TimelineEventCard
                group={eventGroup}
                isPublic={isPublic}
                isTeamMember={isTeamMember}
                key={eventGroup[0].id}
                subjectId={subjectId}
                user={user}
              />
            ))}
          </div>
        );
      })}
      {hasMore && !!eventsState.length && (
        <div className="mt-4">
          <div className="mx-4 mb-4 h-12 w-full border-l-2 border-dashed border-alpha-2" />
          <Button
            className="w-full"
            colorScheme="transparent"
            loading={isTransitioning}
            loadingText="Loading…"
            onClick={() =>
              startTransition(async () => {
                const to = Number(searchParams.get('to')) || pageSize - 1;
                const newTo = to + pageSize;

                const { data: newEvents } = await listEvents({
                  from: to + 1,
                  isPublic,
                  subjectId,
                  to: newTo,
                });

                if (!newEvents) {
                  setHasMore(false);
                  return;
                }

                if (newEvents.length < pageSize) {
                  setHasMore(false);
                }

                setEventsState((state) => [...state, ...newEvents]);
                window.history.replaceState(null, '', `?to=${newTo}`);
              })
            }
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default TimelineEvents;
