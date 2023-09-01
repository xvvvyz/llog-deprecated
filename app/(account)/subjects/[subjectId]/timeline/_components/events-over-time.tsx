'use client';

import PlotFigure from '@/(account)/subjects/[subjectId]/timeline/_components/plot-figure';
import { axisY, dot } from '@observablehq/plot';

interface EventsOverTimeProps {
  events?: Array<Record<string, unknown>>;
  width?: number;
}

const EventsOverTime = ({ events = [], width }: EventsOverTimeProps) => {
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
          dot(events, {
            channels: {
              recordedBy: 'Recorded by',
              sessionNumber: 'Session number',
            },
            sort: { y: '-x' },
            tip: true,
            x: (d) => new Date(d.Timestamp),
            y: 'Name',
          }),
        ],
        title: 'Events over time',
        width,
        x: { label: 'Time', type: 'time' },
        y: { padding: 0.53 },
      }}
    />
  );
};

export default EventsOverTime;
