'use client';

import ChartType from '@/_constants/enum-chart-type';
import Interval from '@/_constants/enum-interval';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import Reducer from '@/_constants/enum-reducer';
import TimeSinceMilliseconds from '@/_constants/enum-time-since-milliseconds';
import { ListEventsData } from '@/_queries/list-events';
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
  events: ListEventsData;
  id?: string;
  includeEventsFrom: string | null;
  includeEventsSince: TimeSinceMilliseconds | null;
  inputId: string;
  inputOptions?: string[];
  interval: Interval | null;
  isPublic?: boolean;
  lineCurveFunction: LineCurveFunction;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  reducer: Reducer;
  setActiveId?: React.Dispatch<React.SetStateAction<string | null>>;
  setSyncDate?: React.Dispatch<React.SetStateAction<Date | null>>;
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
  events,
  id,
  includeEventsFrom,
  includeEventsSince,
  inputId,
  inputOptions,
  interval,
  isPublic,
  lineCurveFunction,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  reducer,
  setActiveId,
  setSyncDate,
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

        marks.push(
          P.axisX({
            tickSize: 0,
          }),
        );

        marks.push(
          P.axisY({
            label: null,
            tickFormat:
              isDuration && reducer !== Reducer.Count
                ? (t) => `${humanizeDurationShort(t * 1000)}`
                : undefined,
            tickSize: 0,
          }),
        );

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
                r: 4,
                title: (d) => JSON.stringify({ Id: d.Id }),
                x,
              }),
            ),
          );

          marks.push(
            P.text(
              annotationRows,
              P.pointerX({
                dy: -22,
                frameAnchor: 'top',
                text: (d) =>
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

        if (interval) {
          if (showLinearRegression) {
            marks.push(
              P.linearRegressionY(
                rows,
                P.binX<P.LinearRegressionYOptions>(
                  { y: reducer },
                  {
                    ci: showLinearRegressionConfidence ? undefined : 0,
                    fill: 'hsla(5, 85%, 50%, 10%)',
                    fillOpacity: 1,
                    interval: P.timeInterval(interval),
                    stroke: 'hsla(5, 85%, 50%, 75%)',
                    x,
                    y,
                  },
                ),
              ),
            );
          }

          marks.push(
            P.lineY(
              rows,
              P.binX<P.LineYOptions>(
                {
                  interval: P.timeInterval(interval),
                  y: reducer,
                },
                {
                  curve: lineCurveFunction,
                  x,
                  y,
                },
              ),
            ),
          );
        } else {
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

          if (!isInputNominal) {
            marks.push(
              P.lineY(rows, {
                curve: lineCurveFunction,
                x,
                y,
              }),
            );
          }

          marks.push(
            P.dot(rows, {
              fill: '#fff',
              fillOpacity: 0.5,
              x,
              y,
            }),
          );

          marks.push(
            P.dot(
              rows,
              P.pointer({
                fill: '#fff',
                maxRadius: 20,
                r: 4,
                title: (d) => JSON.stringify({ Id: d.Id, Priority: true }),
                x,
                y,
              }),
            ),
          );

          marks.push(
            P.ruleX(
              rows,
              P.pointerX({
                maxRadius: 500,
                stroke: '#fff',
                strokeOpacity: 0.25,
                title: (d) => JSON.stringify({ Time: d.Time }),
                x,
              }),
            ),
          );
        }

        if (syncDate) {
          marks.push(
            P.ruleX([0], {
              stroke: '#fff',
              strokeOpacity: 0.25,
              x: syncDate,
            }),
          );
        }
      }
    }

    const plot = P.plot({
      color: { legend: !!interval },
      height: isInputNominal && !interval ? undefined : 220,
      inset: 8,
      marginBottom: Number(marginBottom),
      marginLeft: Number(marginLeft),
      marginRight: Number(marginRight),
      marginTop: Number(marginTop),
      marks,
      style: { overflow: 'visible' },
      width: Math.max(width, 500),
      x: marks.length ? { type: 'time' } : undefined,
    });

    const getActiveMarks = () => {
      const data = plot.querySelectorAll('title');
      if (!data.length) return;

      const marks: Array<{
        Id?: string;
        Priority?: string;
        Time?: string;
      }> = [];

      for (const datum of Array.from(data)) {
        try {
          marks.push(JSON.parse(datum.innerHTML ?? ''));
        } catch {
          // noop
        }
      }

      return marks;
    };

    const onClick = () => {
      const withId = getActiveMarks()?.filter((item) => item?.Id) ?? [];

      const mark =
        withId.length > 1 ? withId.find((item) => item?.Priority) : withId[0];

      if (!mark) return;
      const shareOrSubjects = isPublic ? 'share' : 'subjects';
      const href = `/${shareOrSubjects}/${subjectId}/events/${mark.Id}`;
      router.push(href, { scroll: false });
    };

    const onEnd = () => {
      setActiveId?.(null);
      setSyncDate?.(null);
    };

    const onMove = throttle(() => {
      const withTime = getActiveMarks()?.find((item) => item?.Time);
      if (!id || !withTime?.Time) return;
      setActiveId?.(id);
      setSyncDate?.(new Date(withTime.Time));
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
    events,
    id,
    includeEventsFrom,
    includeEventsSince,
    inputId,
    inputOptions,
    interval,
    isPublic,
    lineCurveFunction,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    reducer,
    router,
    setActiveId,
    setSyncDate,
    showLinearRegression,
    showLinearRegressionConfidence,
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
