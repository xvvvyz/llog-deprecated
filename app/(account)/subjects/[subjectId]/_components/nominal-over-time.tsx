'use client';

import PlotFigure from '@/(account)/subjects/[subjectId]/_components/plot-figure';
import { axisY, dot, pointer, tip } from '@observablehq/plot';

interface NominalOverTimeProps {
  channels: Record<string, string>;
  events?: Array<Record<string, unknown>>;
  inputKey: string;
  inputLabel?: string;
  width?: number;
}

const NominalOverTime = ({
  channels,
  events = [],
  inputKey,
  inputLabel,
  width,
}: NominalOverTimeProps) => {
  if (events.length < 2) return null;

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
          dot(events, {
            fill: 'currentColor',
            x: (d) => new Date(d.Time),
            y: inputKey,
          }),
          tip(
            events,
            pointer({
              channels,
              lineWidth: 50,
              x: (d) => new Date(d.Time),
              y: inputKey,
            }),
          ),
        ],
        title: `${inputLabel ?? inputKey} / time`,
        width,
        x: { label: 'Time', type: 'time' },
        y: { padding: 0.53 },
      }}
    />
  );
};

export default NominalOverTime;
