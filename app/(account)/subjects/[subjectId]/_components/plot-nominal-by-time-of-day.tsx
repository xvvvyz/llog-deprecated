'use client';

import PlotFigure from '@/(account)/subjects/[subjectId]/_components/plot-figure';
import { axisY, cell, group, pointer, tip } from '@observablehq/plot';

interface PlotNominalByTimeOfDayProps {
  events?: Array<Record<string, unknown>>;
  inputKey: string;
  inputLabel?: string;
  width?: number;
}

const PlotNominalByTimeOfDay = ({
  events = [],
  inputKey,
  inputLabel,
  width,
}: PlotNominalByTimeOfDayProps) => {
  if (events.length < 2 || !width) return null;
  const domain = Array.from({ length: 24 }).map((_, i) => i);
  const ticks = [];
  const tickRatio = Math.ceil(domain.length / (width / 60));
  for (let i = 0; i < domain.length; i += tickRatio) ticks.push(domain[i]);

  return (
    <PlotFigure
      options={{
        marks: [
          axisY({
            label: null,
            lineWidth: 10,
            textOverflow: 'ellipsis',
            tickSize: 0,
          }),
          cell(
            events,
            group(
              { fill: 'count' },
              {
                x: (d) => new Date(d.Time).getHours(),
                y: inputKey,
              },
            ),
          ),
          tip(
            events,
            group(
              { fill: 'count' },
              pointer({
                channels: {
                  'Hour of day': ([d]) =>
                    new Date(d.Time).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                    }),
                },
                lineWidth: 50,
                x: (d) => new Date(d.Time).getHours(),
                y: inputKey,
              }),
            ),
          ),
        ],
        title: `${inputLabel ?? inputKey} / hour of day`,
        width,
        x: {
          domain,
          label: 'Hour of day',
          tickFormat: (d) => {
            const date = new Date();
            date.setHours(d);
            return date.toLocaleTimeString(undefined, { hour: 'numeric' });
          },
          ticks,
        },
        y: { padding: 0.05 },
      }}
    />
  );
};

export default PlotNominalByTimeOfDay;
