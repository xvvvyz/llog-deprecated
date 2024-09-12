'use client';

import BarInterval from '@/_constants/enum-bar-interval';
import BarReducer from '@/_constants/enum-bar-reducer';
import ChartType from '@/_constants/enum-chart-type';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import TimeSinceMilliseconds from '@/_constants/enum-time-since-milliseconds';
import { ListEventsData } from '@/_queries/list-events';
import formatDateTime from '@/_utilities/format-date-time';
import formatDirtyColumnHeader from '@/_utilities/format-dirty-column-header';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getInputDetailsFromEvents from '@/_utilities/get-input-details-from-events';
import humanizeDurationShort from '@/_utilities/humanize-duration-short';
import * as P from '@observablehq/plot';
import { useParentSize } from '@visx/responsive';
import { throttle } from 'lodash';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface InsightPlot {
  annotationIncludeEventsFrom: string | null;
  annotationInputId: string;
  annotationInputOptions: string[];
  annotationLabel: string;
  barInterval: BarInterval;
  barReducer: BarReducer;
  defaultHeight?: number;
  events: ListEventsData;
  id?: string;
  includeEventsFrom: string | null;
  includeEventsSince: TimeSinceMilliseconds | null;
  inputId: string;
  inputOptions?: string[];
  isPublic?: boolean;
  lineCurveFunction: LineCurveFunction;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  setActiveId?: React.Dispatch<React.SetStateAction<string | null>>;
  setSyncDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  showBars: boolean;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  showLinearRegressionConfidence?: boolean;
  subjectId: string;
  syncDate?: Date | null;
  title: string;
  type: ChartType;
}

const InsightPlot = ({
  annotationIncludeEventsFrom,
  annotationInputId,
  annotationInputOptions,
  annotationLabel,
  barInterval,
  barReducer,
  defaultHeight,
  events,
  id,
  includeEventsFrom,
  includeEventsSince,
  inputId,
  inputOptions,
  isPublic,
  lineCurveFunction,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  setActiveId,
  setSyncDate,
  showBars,
  showDots,
  showLine,
  showLinearRegression,
  showLinearRegressionConfidence,
  subjectId,
  syncDate,
  type,
}: InsightPlot) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { parentRef, width } = useParentSize();

  React.useEffect(() => {
    if (!containerRef.current || !events) return;

    const { input, isDuration, isInputNominal } = getInputDetailsFromEvents({
      events,
      inputId,
    });

    const marks = [];

    switch (type) {
      case ChartType.TimeSeries: {
        const x = 'Time';
        const y = formatDirtyColumnHeader(input?.label);

        const rows = formatTabularEvents(events, {
          filterByInputId: inputId,
          filterByInputOptions: inputOptions,
          flattenColumnValues: true,
          includeEventsFrom,
          includeEventsSince,
          parseTime: true,
        });

        if (showBars || showLine || showLinearRegression || showDots) {
          marks.push(
            P.axisX({
              fill: '#C3C3C2',
              stroke: 'hsla(0, 0%, 100%, 10%)',
            }),
          );

          marks.push(
            P.axisY({
              fill: '#C3C3C2',
              label: null,
              stroke: 'hsla(0, 0%, 100%, 10%)',
              tickFormat: isDuration
                ? (t) => `${humanizeDurationShort(t * 1000)}`
                : undefined,
            }),
          );
        }

        if (showBars) {
          marks.push(
            P.rectY(
              rows,
              P.binX<P.RectYOptions>(
                {
                  title: isInputNominal
                    ? (d: typeof rows) => `${d[0][y]}: ${d.length}`
                    : undefined,
                  y: barReducer,
                },
                {
                  fill: isInputNominal ? y : 'hsla(0, 0%, 100%, 10%)',
                  inset: 1,
                  interval: P.timeInterval(barInterval),
                  order: isInputNominal ? '-sum' : undefined,
                  tip: isInputNominal,
                  x,
                  y: isInputNominal ? undefined : y,
                },
              ),
            ),
          );
        }

        if (showLine) {
          marks.push(P.line(rows, { curve: lineCurveFunction, x, y }));
        }

        if (showLinearRegression) {
          marks.push(
            P.linearRegressionY(rows, {
              ci: showLinearRegressionConfidence ? undefined : 0,
              fill: 'hsla(5, 85%, 50%, 10%)',
              fillOpacity: 1,
              stroke: 'hsla(5, 85%, 50%, 75%)',
              x,
              y,
            }),
          );
        }

        if (annotationInputId) {
          const annotationInputDetails = getInputDetailsFromEvents({
            events,
            inputId: annotationInputId,
          });

          const annotationRows = formatTabularEvents(events, {
            filterByInputId: annotationInputId,
            filterByInputOptions: annotationInputOptions,
            flattenColumnValues: true,
            includeEventsFrom: annotationIncludeEventsFrom,
            includeEventsSince,
            parseTime: true,
          });

          const columnHeader = formatDirtyColumnHeader(
            annotationInputDetails.input?.label,
          );

          marks.push(
            P.ruleX(annotationRows, {
              stroke: 'hsla(5, 85%, 50%, 75%)',
              x,
            }),
          );

          marks.push(
            P.ruleX(
              annotationRows,
              P.pointerX({
                maxRadius: 100,
                stroke: 'hsl(5, 85%, 50%)',
                x,
              }),
            ),
          );

          marks.push(
            P.dot(annotationRows, {
              dy: -3,
              fill: 'hsla(5, 85%, 50%, 50%)',
              frameAnchor: 'top',
              x,
            }),
          );

          marks.push(
            P.dot(
              annotationRows,
              P.pointerX({
                dy: -3,
                fill: 'hsla(5, 85%, 50%, 100%)',
                frameAnchor: 'top',
                maxRadius: 100,
                title: (d) => JSON.stringify(d),
                x,
              }),
            ),
          );

          marks.push(
            P.text(
              annotationRows,
              P.pointerX({
                dy: -22,
                fill: '#fff',
                frameAnchor: 'top',
                maxRadius: 100,
                text: (d) =>
                  annotationLabel ||
                  `${columnHeader} - ${
                    annotationInputDetails.isDuration
                      ? humanizeDurationShort(d[columnHeader] * 1000)
                      : d[columnHeader]
                  }`,
                textAnchor: 'middle',
                x,
              }),
            ),
          );
        }

        if (showDots) {
          marks.push(P.dot(rows, { fill: 'hsla(0, 0%, 100%, 50%)', x, y }));

          marks.push(
            P.dot(
              rows,
              P.pointer({
                fill: '#fff',
                maxRadius: 50,
                title: (d) => JSON.stringify({ ...d, priority: true }),
                x,
                y,
              }),
            ),
          );

          marks.push(
            P.ruleX(
              rows,
              P.pointerX({
                maxRadius: 100,
                py: y,
                stroke: 'hsla(0, 0%, 100%, 25%)',
                x,
              }),
            ),
          );

          marks.push(
            P.text(
              rows,
              P.pointerX({
                dy: 16,
                fill: '#fff',
                frameAnchor: 'bottom',
                maxRadius: 100,
                stroke: 'hsl(0, 0%, 16%)',
                strokeWidth: 10,
                text: (d) => formatDateTime(d[x], { month: 'long' }),
                textAnchor: 'middle',
                x,
              }),
            ),
          );

          marks.push(
            P.text(
              rows,
              P.pointerX({
                dx: -9,
                fill: '#fff',
                frameAnchor: 'left',
                maxRadius: 100,
                px: x,
                stroke: 'hsl(0, 0%, 16%)',
                strokeWidth: 10,
                text: (d) =>
                  isDuration ? `${humanizeDurationShort(d[y] * 1000)}` : d[y],
                textAnchor: 'end',
                y,
              }),
            ),
          );
        }

        if (syncDate) {
          marks.push(
            P.ruleX([0], { stroke: 'hsla(0, 0%, 100%, 25%)', x: syncDate }),
          );
        }
      }
    }

    const plot = P.plot({
      color: { legend: true },
      height:
        isInputNominal && (showDots || showLine || showLinearRegression)
          ? undefined
          : defaultHeight,
      inset: 10,
      marginBottom: Number(marginBottom),
      marginLeft: Number(marginLeft),
      marginRight: Number(marginRight),
      marginTop: Number(marginTop),
      marks,
      width,
      x: marks.length ? { type: 'time' } : undefined,
    });

    const getActiveDatum = () => {
      const data = plot.querySelectorAll('title');
      if (!data.length) return;
      let final: { Id: string; Time: string } | null = null;

      for (const datum of Array.from(data)) {
        try {
          const { Id, Time, priority } = JSON.parse(datum.innerHTML ?? '');
          if ((Id && !final) || priority) final = { Id, Time };
        } catch {
          // noop
        }
      }

      return final;
    };

    const onClick = () => {
      const datum = getActiveDatum();
      if (!datum) return;
      const shareOrSubjects = isPublic ? 'share' : 'subjects';
      const href = `/${shareOrSubjects}/${subjectId}/events/${datum.Id}`;
      router.push(href, { scroll: false });
    };

    const onEnd = () => {
      setActiveId?.(null);
      setSyncDate?.(null);
    };

    const onMove = throttle(() => {
      const datum = getActiveDatum();
      if (!datum) return;
      setActiveId?.(id ?? null);
      setSyncDate?.(datum.Time ? new Date(datum.Time) : null);
    }, 50);

    plot.addEventListener('click', onClick);
    plot.addEventListener('mouseleave', onEnd);
    plot.addEventListener('mousemove', onMove);
    plot.addEventListener('touchcancel', onEnd);
    plot.addEventListener('touchend', onEnd);
    plot.addEventListener('touchmove', onMove);

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [
    annotationIncludeEventsFrom,
    annotationInputId,
    annotationInputOptions,
    annotationLabel,
    barInterval,
    barReducer,
    defaultHeight,
    events,
    id,
    includeEventsFrom,
    includeEventsSince,
    inputId,
    inputOptions,
    isPublic,
    lineCurveFunction,
    showLinearRegressionConfidence,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    router,
    setActiveId,
    setSyncDate,
    showBars,
    showDots,
    showLine,
    showLinearRegression,
    subjectId,
    syncDate,
    type,
    width,
  ]);

  return (
    <div className="h-full w-full" ref={parentRef}>
      <div ref={containerRef} />
    </div>
  );
};

export default InsightPlot;
