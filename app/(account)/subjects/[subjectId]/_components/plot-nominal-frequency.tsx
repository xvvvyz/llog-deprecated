'use client';

import PlotFigure from '@/(account)/subjects/[subjectId]/_components/plot-figure';
import { axisY, barX, groupY } from '@observablehq/plot';

interface PlotNominalFrequencyProps {
  events?: Array<Record<string, unknown>>;
  inputKey: string;
  inputLabel?: string;
  width?: number;
}

const PlotNominalFrequency = ({
  events = [],
  inputKey,
  inputLabel,
  width,
}: PlotNominalFrequencyProps) => {
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
          barX(
            events,
            groupY({ x: 'count' }, { sort: { y: '-x' }, y: inputKey }),
          ),
        ],
        title: `${inputLabel ?? inputKey} frequency`,
        width,
        x: { label: 'Frequency', tickFormat: (d) => (d % 1 === 0 ? d : '') },
        y: { padding: 0.53 },
      }}
    />
  );
};

export default PlotNominalFrequency;
