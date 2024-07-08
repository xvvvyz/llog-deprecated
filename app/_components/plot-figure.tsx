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
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

const PlotFigure = ({
  barInterval,
  barReducer,
  defaultHeight,
  events,
  includeEventsFrom,
  includeEventsSince,
  id,
  inputId,
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
  subjectId,
  syncDate,
  type,
}: {
  barInterval: BarInterval;
  barReducer: BarReducer;
  defaultHeight?: number;
  events: ListEventsData;
  includeEventsFrom: string | null;
  includeEventsSince: TimeSinceMilliseconds | null;
  id?: string;
  inputId: string;
  isPublic?: boolean;
  lineCurveFunction: LineCurveFunction;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  setActiveId?: Dispatch<SetStateAction<string | null>>;
  setSyncDate?: Dispatch<SetStateAction<Date | null>>;
  showBars: boolean;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  subjectId: string;
  syncDate?: Date | null;
  title: string;
  type: ChartType;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { parentRef, width } = useParentSize();

  useEffect(() => {
    if (!containerRef.current || !events) return;

    const { input, isDuration, isInputNominal } = getInputDetailsFromEvents({
      events,
      inputId,
    });

    const marks = [];

    switch (type) {
      case ChartType.TimeSeries: {
        const rows = formatTabularEvents(events, {
          filterByInputId: inputId,
          flattenInputs: true,
          includeEventsFrom,
          includeEventsSince,
          parseTime: true,
        });

        const x = 'Time';
        const y = formatDirtyColumnHeader(input?.label);

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

        if (showBars) {
          marks.push(
            P.rectY(
              rows,
              P.binX<P.RectYOptions>(
                { y: barReducer },
                {
                  fill: isInputNominal ? y : 'hsla(0, 0%, 100%, 10%)',
                  inset: 1,
                  interval: barInterval as P.LiteralTimeInterval,
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

        if (showDots) {
          marks.push(P.dot(rows, { fill: 'hsla(0, 0%, 100%, 50%)', x, y }));
        }

        if (showLinearRegression) {
          marks.push(
            P.linearRegressionY(rows, {
              ci: 0,
              stroke: 'hsla(5, 85%, 50%, 75%)',
              x,
              y,
            }),
          );
        }

        if (!showBars || !isInputNominal) {
          marks.push(
            P.dot(
              rows,
              P.pointerX({
                fill: '#fff',
                maxRadius: 100,
                title: (d) => JSON.stringify(d),
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
            P.ruleY(
              rows,
              P.pointerX({
                maxRadius: 100,
                px: x,
                stroke: 'hsla(0, 0%, 100%, 25%)',
                y,
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
      height: isInputNominal && !showBars ? undefined : defaultHeight,
      inset: 10,
      marginBottom: Number(marginBottom),
      marginLeft: Number(marginLeft),
      marginRight: Number(marginRight),
      marginTop: Number(marginTop),
      marks,
      width,
    });

    const onClick = () => {
      try {
        const datum = plot.querySelector('title')?.innerHTML ?? '';
        if (!datum) return;
        const { Id } = JSON.parse(datum);
        if (!Id) return;
        const shareOrSubjects = isPublic ? 'share' : 'subjects';
        const href = `/${shareOrSubjects}/${subjectId}/events/${Id}`;
        router.push(href, { scroll: false });
      } catch (e) {
        // noop
      }
    };

    const onEnd = () => {
      setActiveId?.(null);
      setSyncDate?.(null);
    };

    const onMove = throttle(() => {
      try {
        const datum = plot.querySelector('title')?.innerHTML ?? '';
        if (!datum) return;
        const { Time } = JSON.parse(datum);
        setActiveId?.(id ?? null);
        setSyncDate?.(Time ? new Date(Time) : null);
      } catch (e) {
        // noop
      }
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
    barInterval,
    barReducer,
    defaultHeight,
    events,
    includeEventsFrom,
    includeEventsSince,
    id,
    inputId,
    isPublic,
    lineCurveFunction,
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

export default PlotFigure;
