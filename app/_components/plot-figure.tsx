'use client';

import BarInterval from '@/_constants/enum-bar-interval';
import BarReducer from '@/_constants/enum-bar-reducer';
import ChartType from '@/_constants/enum-chart-type';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import formatDirtyColumnHeader from '@/_utilities/format-dirty-column-header';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import * as P from '@observablehq/plot';
import { plot, RectYOptions } from '@observablehq/plot';
import { useParentSize } from '@visx/responsive';
import { throttle } from 'lodash';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

const PlotFigure = ({
  barInterval,
  barReducer,
  defaultHeight,
  events,
  id,
  input,
  inputIsNominal,
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
  events: ReturnType<typeof formatTabularEvents>;
  id?: string;
  input: string;
  inputIsNominal: boolean;
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
    if (!containerRef.current) return;

    const marks = [];
    const column = formatDirtyColumnHeader(input);

    const formatted: ReturnType<typeof formatTabularEvents> &
      Array<{ Time: Date }> = [];

    for (const event of events) {
      const f = { ...event, Time: new Date(event.Time as string) };
      if (typeof event[column] === 'undefined') continue;

      if (Array.isArray(event[column])) {
        (event[column] as string[]).forEach((value) => {
          formatted.push({ ...f, [column]: value });
        });
      } else {
        formatted.push(f);
      }
    }

    switch (type) {
      case ChartType.TimeSeries: {
        const x = 'Time';
        const y = column;

        marks.push(
          P.axisX({ fill: '#C3C3C2', stroke: 'hsla(0, 0%, 100%, 10%)' }),
        );

        marks.push(
          P.axisY({ fill: '#C3C3C2', stroke: 'hsla(0, 0%, 100%, 10%)' }),
        );

        if (showBars) {
          marks.push(
            P.rectY(
              formatted,
              P.binX<RectYOptions>(
                { y: barReducer },
                {
                  fill: inputIsNominal ? y : 'hsl(45, 5%, 20%)',
                  inset: 1,
                  interval: barInterval as P.LiteralTimeInterval,
                  tip: inputIsNominal,
                  x,
                  y: inputIsNominal ? undefined : y,
                },
              ),
            ),
          );
        }

        if (showLine) {
          marks.push(P.line(formatted, { curve: lineCurveFunction, x, y }));
        }

        if (showDots) {
          marks.push(
            P.dot(formatted, { fill: 'hsla(0, 0%, 100%, 50%)', x, y }),
          );
        }

        if (showLinearRegression) {
          marks.push(
            P.linearRegressionY(formatted, {
              ci: 0,
              stroke: 'hsla(5, 85%, 50%, 75%)',
              x,
              y,
            }),
          );
        }

        if (!showBars || !inputIsNominal) {
          marks.push(
            P[inputIsNominal ? 'crosshairY' : 'crosshairX'](formatted, {
              maxRadius: 100,
              ruleStroke: 'hsla(0, 0%, 100%, 25%)',
              ruleStrokeOpacity: 1,
              textFill: '#fff',
              textStroke: '#1A1917',
              textStrokeWidth: 10,
              x,
              y,
            }),
          );

          marks.push(
            P.dot(
              formatted,
              P[inputIsNominal ? 'pointerY' : 'pointerX']({
                fill: '#fff',
                maxRadius: 100,
                title: (d) => JSON.stringify(d),
                x,
                y,
              }),
            ),
          );
        }

        if (syncDate) {
          marks.push(
            P.ruleX([0], {
              stroke: 'hsla(0, 0%, 100%, 25%)',
              x: syncDate,
            }),
          );
        }
      }
    }

    const p = plot({
      height: inputIsNominal && !showBars ? undefined : defaultHeight,
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
        const datum = p.querySelector('title')?.innerHTML ?? '';
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
        const datum = p.querySelector('title')?.innerHTML ?? '';
        if (!datum) return;
        const { Time } = JSON.parse(datum);
        setActiveId?.(id ?? null);
        setSyncDate?.(Time ? new Date(Time) : null);
      } catch (e) {
        // noop
      }
    }, 50);

    p.addEventListener('click', onClick);
    p.addEventListener('mouseleave', onEnd);
    p.addEventListener('mousemove', onMove);
    p.addEventListener('touchcancel', onEnd);
    p.addEventListener('touchend', onEnd);
    p.addEventListener('touchmove', onMove);
    containerRef.current.append(p);
    return () => p.remove();
  }, [
    barInterval,
    barReducer,
    defaultHeight,
    events,
    id,
    input,
    inputIsNominal,
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
