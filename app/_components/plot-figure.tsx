'use client';

import ChartType from '@/_constants/enum-chart-type';
import formatPlot from '@/_utilities/format-plot';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { plot } from '@observablehq/plot';
import { useParentSize } from '@visx/responsive';
import { throttle } from 'lodash';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

const PlotFigure = ({
  column,
  curveFunction,
  defaultHeight,
  events,
  id,
  isPublic,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  setActiveId,
  setSyncDate,
  showDots,
  showLine,
  showLinearRegression,
  showXAxisLabel,
  showXAxisTicks,
  showYAxisLabel,
  showYAxisTicks,
  subjectId,
  syncDate,
  type,
}: {
  column: string;
  curveFunction: string;
  defaultHeight?: number;
  events: ReturnType<typeof formatTabularEvents>;
  id?: string;
  isPublic?: boolean;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  setActiveId?: Dispatch<SetStateAction<string | null>>;
  setSyncDate?: Dispatch<SetStateAction<Date | null>>;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  showXAxisLabel: boolean;
  showXAxisTicks: boolean;
  showYAxisLabel: boolean;
  showYAxisTicks: boolean;
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

    const p = plot(
      formatPlot({
        column,
        curveFunction,
        defaultHeight,
        events,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        showDots,
        showLine,
        showLinearRegression,
        showXAxisLabel,
        showXAxisTicks,
        showYAxisLabel,
        showYAxisTicks,
        syncDate,
        type,
        width,
      }),
    );

    const onClick = () => {
      const datum = p.querySelector('title')?.innerHTML ?? '';
      if (!datum) return;
      const { Id } = JSON.parse(datum);
      if (!Id) return;
      const shareOrSubjects = isPublic ? 'share' : 'subjects';
      const href = `/${shareOrSubjects}/${subjectId}/events/${Id}`;
      router.push(href, { scroll: false });
    };

    const onEnd = () => {
      setActiveId?.(null);
      setSyncDate?.(null);
    };

    const onMove = throttle(() => {
      const datum = p.querySelector('title')?.innerHTML ?? '';
      if (!datum) return;
      const { Time } = JSON.parse(datum);
      setActiveId?.(id ?? null);
      setSyncDate?.(Time ? new Date(Time) : null);
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
    column,
    curveFunction,
    defaultHeight,
    events,
    id,
    isPublic,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    router,
    setActiveId,
    setSyncDate,
    showDots,
    showLine,
    showLinearRegression,
    showXAxisLabel,
    showXAxisTicks,
    showYAxisLabel,
    showYAxisTicks,
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
