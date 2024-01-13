'use client';

import PlotFigure from '@/_components/plot-figure';

import {
  axisY,
  Channel,
  ChannelValue,
  dot,
  pointer,
  tip,
} from '@observablehq/plot';

interface PlotNominalOverTimeProps {
  channels: Record<string, ChannelValue | Channel>;
  events?: Array<Record<string, unknown>>;
  inputKey: string;
  inputLabel?: string;
  width?: number;
}

const PlotNominalOverTime = ({
  channels,
  events = [],
  inputKey,
  inputLabel,
  width,
}: PlotNominalOverTimeProps) => {
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

export default PlotNominalOverTime;
