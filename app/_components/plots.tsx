'use client';

import PlotNominalByTimeOfDay from '@/_components/plot-nominal-by-time-of-day';
import PlotNominalFrequency from '@/_components/plot-nominal-frequency';
import PlotNominalOverTime from '@/_components/plot-nominal-over-time';
import PlotQuantitativeOverTime from '@/_components/plot-quantitative-over-time';
import Spinner from '@/_components/spinner';
import formatDateTime from '@/_utilities/format-date-time';
import { useParentSize } from '@cutting/use-get-parent-size';
import { Channel, ChannelValue } from '@observablehq/plot';
import { useToggle } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';

interface PlotsProps {
  isPublic?: boolean;
  subjectId: string;
}

const Plots = ({ isPublic, subjectId }: PlotsProps) => {
  const [data, setData] = useState<Array<Record<string, unknown>>>();
  const [isLoading, toggleIsLoading] = useToggle(true);
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useParentSize(ref);

  useEffect(() => {
    (async () => {
      const shareOrSubjects = isPublic ? 'share' : 'subjects';
      const res = await fetch(`/${shareOrSubjects}/${subjectId}/events.json`);
      setData(await res.json());
      toggleIsLoading(false);
    })();
  }, [isPublic, setData, subjectId, toggleIsLoading]);

  const { channels, events, nominalInputEvents, quantitativeInputEvents } = data
    ? data.reduce<{
        channels: Record<string, ChannelValue | Channel>;
        events: Array<Record<string, unknown>>;
        nominalInputEvents: Record<string, Array<Record<string, unknown>>>;
        quantitativeInputEvents: Record<string, Array<Record<string, unknown>>>;
      }>(
        (acc, d) => {
          if (
            typeof d['Session number'] === 'undefined' ||
            d['Module number'] === 1
          ) {
            acc.events.push(d);
          }

          Object.entries(d).forEach(([k, v]) => {
            acc.channels[k] =
              k === 'Time'
                ? (d: Record<string, string>) => formatDateTime(d.Time)
                : k;

            if (Array.isArray(v) && !/^(Comments)$/.test(k)) {
              v.forEach((vv) => {
                const add = { ...d, [k]: vv };

                if (acc.nominalInputEvents[k]) {
                  acc.nominalInputEvents[k].push(add);
                } else {
                  acc.nominalInputEvents[k] = [add];
                }
              });
            } else if (typeof v === 'string' && !/^(Name|Time)$/.test(k)) {
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
      {Object.entries(quantitativeInputEvents).map(([k, v]) => (
        <PlotQuantitativeOverTime
          channels={channels}
          events={v}
          inputKey={k}
          key={`${k}-quantitative`}
          width={width}
        />
      ))}
      {Object.entries(nominalInputEvents).map(([k, v]) => (
        <div className="space-y-16" key={`${k}-nominal`}>
          <PlotNominalOverTime
            channels={channels}
            events={v}
            inputKey={k}
            width={width}
          />
          <PlotNominalFrequency events={v} inputKey={k} width={width} />
          <PlotNominalByTimeOfDay events={v} inputKey={k} width={width} />
        </div>
      ))}
    </div>
  );
};

export default Plots;
