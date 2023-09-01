'use client';

import PlotFigure from '@/(account)/subjects/[subjectId]/timeline/_components/plot-figure';
import { axisY, barX, groupY } from '@observablehq/plot';

interface EventCountsProps {
  events?: Array<Record<string, unknown>>;
  width?: number;
}

const EventCounts = ({ events = [], width }: EventCountsProps) => {
  if (!events.length) return null;

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
          barX(
            events,
            groupY(
              { x: 'count' },
              { sort: { reverse: true, y: 'x' }, tip: true, y: 'Name' },
            ),
          ),
        ],
        title: 'Event counts',
        width,
        x: { label: 'Count', tickFormat: (d) => (d % 1 ? null : d) },
        y: { padding: 0.05 },
      }}
    />
  );
};

export default EventCounts;
