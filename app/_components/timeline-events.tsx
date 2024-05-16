'use client';

import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import listEvents, { ListEventsData } from '@/_queries/list-events';
import listPublicEvents from '@/_queries/list-public-events';
import EventFilters from '@/_types/event-filters';
import formatTimelineEvents from '@/_utilities/format-timeline-events';
import { User } from '@supabase/supabase-js';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import TimelineEventCard from './timeline-event-card';

interface TimelineEventsProps {
  events: NonNullable<ListEventsData>;
  filters: EventFilters;
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
  user: User | null;
}

const TimelineEvents = ({
  events,
  filters,
  isPublic,
  isTeamMember,
  subjectId,
  user,
}: TimelineEventsProps) => {
  const [eventsState, setEventsState] = useState(events);
  const [isTransitioning, startTransition] = useTransition();
  const [verifiedEnd, setVerifiedEnd] = useState(false);
  const formattedEvents = formatTimelineEvents(eventsState);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const limit = Number(searchParams.get('limit')) || filters.pageSize - 1;
  const hasMore = eventsState.length > limit && !verifiedEnd;

  // handle router.refresh()
  useEffect(() => {
    setEventsState(events);
    setVerifiedEnd(false);
  }, [events]);

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
                filters.from = limit + 1;
                filters.to = limit + filters.pageSize;

                const { data: newEvents } = isPublic
                  ? await listPublicEvents(subjectId, filters)
                  : await listEvents(subjectId, filters);

                if (!newEvents || newEvents.length < filters.pageSize) {
                  setVerifiedEnd(true);
                  if (!newEvents) return;
                }

                setEventsState((state) => [...state, ...newEvents]);
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set('limit', String(filters.to));
                const searchString = newSearchParams.toString();
                const delimiter = searchString ? '?' : '';
                const url = `${pathname}${delimiter}${searchString}`;
                window.history.replaceState(null, '', url);
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
