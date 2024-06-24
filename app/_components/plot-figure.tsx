'use client';

import ChartType from '@/_constants/enum-chart-type';
import formatPlot from '@/_utilities/format-plot';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { plot } from '@observablehq/plot';
import { useParentSize } from '@visx/responsive';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PlotFigure = ({
  defaultHeight,
  isPublic,
  options,
  subjectId,
}: {
  defaultHeight?: number;
  isPublic?: boolean;
  options: {
    column: string;
    curveFunction: string;
    events: ReturnType<typeof formatTabularEvents>;
    marginBottom: string;
    marginLeft: string;
    marginRight: string;
    marginTop: string;
    showDots: boolean;
    showLine: boolean;
    showLinearRegression: boolean;
    showXAxisLabel: boolean;
    showXAxisTicks: boolean;
    showYAxisLabel: boolean;
    showYAxisTicks: boolean;
    title: string;
    type: ChartType;
  };
  subjectId: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { parentRef, width } = useParentSize();

  useEffect(() => {
    if (!containerRef.current) return;

    const p = plot(
      formatPlot({
        column: options.column,
        curveFunction: options.curveFunction,
        defaultHeight,
        events: options.events,
        marginBottom: options.marginBottom,
        marginLeft: options.marginLeft,
        marginRight: options.marginRight,
        marginTop: options.marginTop,
        showDots: options.showDots,
        showLine: options.showLine,
        showLinearRegression: options.showLinearRegression,
        showXAxisLabel: options.showXAxisLabel,
        showXAxisTicks: options.showXAxisTicks,
        showYAxisLabel: options.showYAxisLabel,
        showYAxisTicks: options.showYAxisTicks,
        type: options.type,
        width,
      }),
    );

    p.addEventListener('click', () => {
      const eventId = p.querySelector('title')?.innerHTML ?? '';
      if (!eventId) return;
      const shareOrSubjects = isPublic ? 'share' : 'subjects';

      router.push(`/${shareOrSubjects}/${subjectId}/events/${eventId}`, {
        scroll: false,
      });
    });

    containerRef.current.append(p);
    return () => p.remove();
  }, [isPublic, options, router, defaultHeight, subjectId, width]);

  return (
    <div className="h-full w-full" ref={parentRef}>
      <div ref={containerRef} />
    </div>
  );
};

export default PlotFigure;
