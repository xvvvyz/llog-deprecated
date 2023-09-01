'use client';

import EventCounts from '@/(account)/subjects/[subjectId]/timeline/_components/event-counts';
import EventsByTimeOfDay from '@/(account)/subjects/[subjectId]/timeline/_components/events-by-time-of-day';
import EventsOverTime from '@/(account)/subjects/[subjectId]/timeline/_components/events-over-time';
import Spinner from '@/_components/spinner';
import { useParentSize } from '@cutting/use-get-parent-size';
import { useToggle } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ChartsProps {
  subjectId: string;
}

const Charts = ({ subjectId }: ChartsProps) => {
  const [data, setData] = useState<Array<Record<string, unknown>>>();
  const [isLoading, toggleIsLoading] = useToggle(true);
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useParentSize(ref);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/subjects/${subjectId}/events.json`);
      setData(await res.json());
      toggleIsLoading(false);
    })();
  }, [setData, subjectId, toggleIsLoading]);

  const events = useMemo(
    () =>
      data?.filter(
        (d) =>
          typeof d['Session number'] === 'undefined' ||
          d['Module number'] === 1,
      ),
    [data],
  );

  return (
    <div className="smallcaps flex flex-col items-center gap-8" ref={ref}>
      {isLoading && <Spinner loadingText="Loading data…" />}
      <EventCounts events={events} width={width} />
      <EventsOverTime events={events} width={width} />
      <EventsByTimeOfDay events={events} width={width} />
    </div>
  );
};

export default Charts;
