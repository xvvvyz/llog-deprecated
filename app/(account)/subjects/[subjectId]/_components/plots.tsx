'use client';

import PlotNominalByTimeOfDay from '@/(account)/subjects/[subjectId]/_components/plot-nominal-by-time-of-day';
import PlotNominalFrequency from '@/(account)/subjects/[subjectId]/_components/plot-nominal-frequency';
import PlotNominalOverTime from '@/(account)/subjects/[subjectId]/_components/plot-nominal-over-time';
import PlotQuantitativeOverTime from '@/(account)/subjects/[subjectId]/_components/plot-quantitative-over-time';
import Spinner from '@/_components/spinner';
import formatDateTime from '@/_utilities/format-date-time';
import { useParentSize } from '@cutting/use-get-parent-size';
import { useToggle } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';

interface PlotsProps {
  subjectId: string;
}

const Plots = ({ subjectId }: PlotsProps) => {
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

  const { channels, events, nominalInputEvents, quantitativeInputEvents } = data
    ? data.reduce(
        (acc: any, d) => {
          if (
            typeof d['Session number'] === 'undefined' ||
            d['Module number'] === 1
          ) {
            acc.events.push(d);
          }

          Object.entries(d).forEach(([k, v]) => {
            acc.channels[k] =
              k === 'Time' ? (d: any) => formatDateTime(d.Time) : k;

            if (Array.isArray(v)) {
              v.forEach((vv) => {
                const add = { ...d, [k]: vv };

                if (acc.nominalInputEvents[k]) {
                  acc.nominalInputEvents[k].push(add);
                } else {
                  acc.nominalInputEvents[k] = [add];
                }
              });
            } else if (typeof v === 'string' && !/(Name|Time)/.test(k)) {
              if (Number.isNaN(Number(v))) {
                if (acc.nominalInputEvents[k]) {
                  acc.nominalInputEvents[k].push(d);
                } else {
                  acc.nominalInputEvents[k] = [d];
                }
              } else {
                const add = { ...d, [k]: Number(v) };

                if (acc.quantitativeInputEvents[k]) {
                  acc.quantitativeInputEvents[k].push(add);
                } else {
                  acc.quantitativeInputEvents[k] = [add];
                }
              }
            }
          });

          return acc;
        },
        {
          channels: {},
          events: [],
          nominalInputEvents: {},
          quantitativeInputEvents: {},
        },
      )
    : {
        channels: {},
        events: [],
        nominalInputEvents: {},
        quantitativeInputEvents: {},
      };

  return (
    <div className="flex flex-col items-center gap-16" ref={ref}>
      {isLoading && <Spinner loadingText="Loading data…" />}
      {!isLoading && events.length < 2 && (
        <p className="text-fg-4">Record events to see insights.</p>
      )}
      <PlotNominalOverTime
        channels={channels}
        events={events}
        inputKey="Name"
        inputLabel="Events"
        width={width}
      />
      <PlotNominalFrequency
        events={events}
        inputKey="Name"
        inputLabel="Events"
        width={width}
      />
      <PlotNominalByTimeOfDay
        events={events}
        inputKey="Name"
        inputLabel="Events"
        width={width}
      />
      {Object.entries(quantitativeInputEvents).map(([k, v]: any) => (
        <PlotQuantitativeOverTime
          channels={channels}
          events={v}
          inputKey={k}
          key={k}
          width={width}
        />
      ))}
      {Object.entries(nominalInputEvents).map(([k, v]: any) => (
        <>
          <PlotNominalOverTime
            channels={channels}
            events={v}
            inputKey={k}
            key={`${k}-over-time`}
            width={width}
          />
          <PlotNominalFrequency
            events={v}
            inputKey={k}
            key={`${k}-counts`}
            width={width}
          />
          <PlotNominalByTimeOfDay
            events={v}
            inputKey={k}
            key={`${k}-by-time-of-day`}
            width={width}
          />
        </>
      ))}
    </div>
  );
};

export default Plots;
