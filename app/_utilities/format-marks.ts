import ChartType from '@/_constants/enum-chart-type';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import * as P from '@observablehq/plot';

const formatMarks = ({
  curveFunction,
  eventMarkers,
  events,
  showDots,
  showLine,
  showLinearRegression,
  showXAxisLabel,
  showXAxisTicks,
  showYAxisLabel,
  showYAxisTicks,
  type,
  xLabel,
  yLabel,
}: {
  curveFunction: string;
  eventMarkers: string[];
  events: ReturnType<typeof formatTabularEvents>;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  showXAxisLabel: boolean;
  showXAxisTicks: boolean;
  showYAxisLabel: boolean;
  showYAxisTicks: boolean;
  type: ChartType;
  xLabel: string;
  yLabel: string;
}) => {
  const marks = [];

  switch (type) {
    case ChartType.TimeSeries: {
      const formatted: ReturnType<typeof formatTabularEvents> &
        Array<{ Time: Date }> = [];

      const filtered = [];
      let maxY;
      let minY;

      for (const event of events) {
        const f = { ...event, Time: new Date(event.Time as string) };
        formatted.push(f);

        if (typeof event[yLabel] === 'number') {
          filtered.push(f);
          const value = event[yLabel] as number;
          maxY = typeof maxY === 'number' ? Math.max(maxY, value) : value;
          minY = typeof minY === 'number' ? Math.min(minY, value) : value;
        }
      }

      marks.push(
        P.axisX({
          label: showXAxisLabel ? xLabel : null,
          stroke: 'hsla(0, 0%, 100%, 20%)',
          ticks: showXAxisTicks ? undefined : [],
        }),
      );

      marks.push(
        P.axisY({
          label: showYAxisLabel ? yLabel : null,
          stroke: 'hsla(0, 0%, 100%, 20%)',
          ticks: showYAxisTicks ? undefined : [],
        }),
      );

      if (showLinearRegression) {
        marks.push(
          P.linearRegressionY(filtered, {
            ci: 0,
            stroke: 'hsl(5, 85%, 40%)',
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (showLine) {
        marks.push(
          P.line(filtered, {
            curve: curveFunction,
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (showDots) {
        marks.push(
          P.dot(filtered, {
            fill: 'hsla(0, 0%, 100%, 75%)',
            opacity: 0.5,
            r: 3,
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (eventMarkers.length) {
        const filtered = formatted.filter((d) =>
          eventMarkers.some((e) => e === d.EventId),
        );

        const y =
          typeof minY === 'number' && typeof maxY === 'number'
            ? maxY + (maxY - minY) * 0.1
            : 0;

        marks.push(
          P.dot(filtered, {
            fill: 'Name',
            x: xLabel,
            y,
          }),
        );

        marks.push(
          P.dot(
            filtered,
            P.pointer({
              maxRadius: 20,
              stroke: 'Name',
              strokeWidth: 5,
              title: (d) => d.Id,
              x: xLabel,
              y,
            }),
          ),
        );

        marks.push(
          P.tip(
            filtered,
            P.pointer({
              maxRadius: 20,
              title: (d) => d.Name,
              x: xLabel,
              y,
            }),
          ),
        );
      }

      marks.push(
        P.crosshairX(filtered, {
          maxRadius: 100,
          ruleStroke: 'hsla(0, 0%, 100%, 20%)',
          ruleStrokeOpacity: 1,
          textFill: 'white',
          textStroke: '#1A1917',
          textStrokeWidth: 10,
          x: xLabel,
          y: yLabel,
        }),
      );

      marks.push(
        P.dot(
          filtered,
          P.pointerX({
            fill: 'hsla(0, 0%, 100%, 75%)',
            maxRadius: 100,
            r: 3,
            title: (d) => d.Id,
            x: xLabel,
            y: yLabel,
          }),
        ),
      );
    }
  }

  return marks;
};

export default formatMarks;
