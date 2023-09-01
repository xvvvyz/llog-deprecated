'use client';

import PlotFigure from '@/(account)/subjects/[subjectId]/timeline/_components/plot-figure';
import { axisY, cell, group } from '@observablehq/plot';

interface EventsByTimeOfDayProps {
  events?: Array<Record<string, unknown>>;
  width?: number;
}

const EventsByTimeOfDay = ({ events = [], width }: EventsByTimeOfDayProps) => {
  if (!events.length || !width) return null;
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
            lineWidth: 9,
            textOverflow: 'ellipsis',
            tickSize: 0,
          }),
          cell(
            events,
            group(
              { fill: 'count' },
              {
                sort: { y: '-fill' },
                tip: true,
                x: (d) => new Date(d.Timestamp).getHours(),
                y: 'Name',
              },
            ),
          ),
        ],
        title: 'Events by hour of day',
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

export default EventsByTimeOfDay;
