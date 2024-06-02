import ChartType from '@/_constants/enum-chart-type';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import * as P from '@observablehq/plot';

const formatMarks = ({
  curveFunction,
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

      for (const event of events) {
        const f = { ...event, Time: new Date(event.Time as string) };

        if (typeof event[yLabel] !== 'undefined') {
          if (Array.isArray(event[yLabel])) {
            (event[yLabel] as string[]).forEach((value) => {
              formatted.push({ ...f, [yLabel]: value });
            });
          } else {
            formatted.push(f);
          }
        }
      }

      marks.push(
        P.axisX({
          fill: '#C3C3C2',
          label: showXAxisLabel ? xLabel : null,
          stroke: 'hsla(0, 0%, 100%, 10%)',
          ticks: showXAxisTicks ? undefined : [],
        }),
      );

      marks.push(
        P.axisY({
          fill: '#C3C3C2',
          label: showYAxisLabel ? yLabel : null,
          stroke: 'hsla(0, 0%, 100%, 10%)',
          ticks: showYAxisTicks ? undefined : [],
        }),
      );

      if (showLinearRegression) {
        marks.push(
          P.linearRegressionY(formatted, {
            ci: 0,
            stroke: 'hsl(5, 85%, 40%)',
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (showLine) {
        marks.push(
          P.line(formatted, {
            curve: curveFunction,
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (showDots) {
        marks.push(
          P.dot(formatted, {
            fill: 'hsla(0, 0%, 100%, 50%)',
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      marks.push(
        P.crosshairX(formatted, {
          maxRadius: 100,
          ruleStroke: 'hsla(0, 0%, 100%, 10%)',
          ruleStrokeOpacity: 1,
          textFill: '#fff',
          textStroke: '#1A1917',
          textStrokeWidth: 10,
          x: xLabel,
          y: yLabel,
        }),
      );

      marks.push(
        P.dot(
          formatted,
          P.pointerX({
            fill: '#fff',
            maxRadius: 100,
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
