'use client';

import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import DEFAULT_PAGE_SIZE from '@/_constants/default-page-size';
import useSupabase from '@/_hooks/use-supabase';
import { ListEventsData } from '@/_server/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import formatDate from '@/_utilities/format-date';
import pageToRange from '@/_utilities/page-to-range';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import TimelineEventCard from './timeline-event-card';

interface TimelineEventsProps {
  events: NonNullable<ListEventsData>;
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
  user: User | null;
}

const TimelineEvents = ({
  events,
  isPublic,
  isTeamMember,
  subjectId,
  user,
}: TimelineEventsProps) => {
  const [formatted, setFormatted] = useState<Map<string, ListEventsData>[]>([]);
  const [hasMore, setHasMore] = useState(events.length === DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginated, setPaginated] = useState(events);
  const supabase = useSupabase();

  useEffect(() => {
    setFormatted(
      Object.values(
        paginated.reduce(
          (acc, event) => {
            const date = formatDate(event.created_at);
            acc[date] = acc[date] ?? new Map();
            const type = firstIfArray(event.type);
            const key = type?.session?.id ?? event.id;
            const keyEvents = acc[date].get(key) ?? [];

            const eventIndex = keyEvents.findIndex(
              (e) => (firstIfArray(e.type)?.order ?? 0) > (type?.order ?? 0),
            );

            keyEvents.splice(
              eventIndex === -1 ? keyEvents.length : eventIndex,
              0,
              event,
            );

            acc[date].set(key, keyEvents);
            return acc;
          },
          {} as Record<string, Map<string, ListEventsData>>,
        ),
      ),
    );
  }, [paginated]);

  useEffect(() => {
    (async () => {
      if (page === 0) return;
      setLoading(true);
      const [from, to] = pageToRange({ page, size: DEFAULT_PAGE_SIZE });

      const { data: newEvents } = (isPublic
        ? await supabase.rpc('list_public_events', {
            from_arg: from,
            public_subject_id: subjectId,
            to_arg: to,
          })
        : await supabase
            .from('events')
            .select(
              `
              comments(
                content,
                created_at,
                id,
                profile:profiles(first_name, id, image_uri, last_name)
              ),
              created_at,
              id,
              inputs:event_inputs(
                input:inputs(id, label, type),
                option:input_options(id, label),
                value
              ),
              profile:profiles(first_name, id, image_uri, last_name),
              type:event_types(
                id,
                session:sessions(
                  id,
                  mission:missions(id, name),
                  order
                ),
                name,
                order
              )`,
            )
            .eq('subject_id', subjectId)
            .order('created_at', { ascending: false })
            .order('created_at', { referencedTable: 'comments' })
            .order('order', { referencedTable: 'inputs' })
            .range(from, to)) as unknown as {
        data: ListEventsData;
      };

      if (!newEvents?.length) {
        setHasMore(false);
      } else {
        setPaginated((state) => [...state, ...newEvents]);
        if (newEvents.length < DEFAULT_PAGE_SIZE) setHasMore(false);
      }

      setLoading(false);
    })();
  }, [isPublic, page, subjectId, supabase]);

  return (
    <>
      {formatted.map((groups) => {
        const dayGroup = Array.from(
          groups.values(),
        ) as NonNullable<ListEventsData>[];

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
      {hasMore && !!formatted.length && (
        <div>
          <div className="mx-4 mb-4 h-12 w-full border-l-2 border-dashed border-alpha-2" />
          <Button
            className="w-full"
            colorScheme="transparent"
            loading={loading}
            loadingText="Loading…"
            onClick={() => setPage((state) => state + 1)}
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default TimelineEvents;
