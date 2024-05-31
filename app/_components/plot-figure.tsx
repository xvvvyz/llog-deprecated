'use client';

import ChartType from '@/_constants/enum-chart-type';
import formatMarks from '@/_utilities/format-marks';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { useParentSize } from '@cutting/use-get-parent-size';
import { plot } from '@observablehq/plot';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PlotFigure = ({
  isPublic,
  options,
  subjectId,
}: {
  isPublic?: boolean;
  options: {
    curveFunction: string;
    eventMarkers: string[];
    events: ReturnType<typeof formatTabularEvents>;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    showDots: boolean;
    showLine: boolean;
    showLinearRegression: boolean;
    showXAxisLabel: boolean;
    showXAxisTicks: boolean;
    showYAxisLabel: boolean;
    showYAxisTicks: boolean;
    title: string;
    type: ChartType;
    xLabel: string;
    yLabel: string;
  };
  subjectId: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { height, width } = useParentSize(parentRef);

  useEffect(() => {
    if (!containerRef.current) return;

    const p = plot({
      height,
      marginBottom: options.marginBottom,
      marginLeft: options.marginLeft,
      marginRight: options.marginRight,
      marginTop: options.marginTop,
      marks: formatMarks({
        curveFunction: options.curveFunction,
        eventMarkers: options.eventMarkers,
        events: options.events,
        showDots: options.showDots,
        showLine: options.showLine,
        showLinearRegression: options.showLinearRegression,
        showXAxisLabel: options.showXAxisLabel,
        showXAxisTicks: options.showXAxisTicks,
        showYAxisLabel: options.showYAxisLabel,
        showYAxisTicks: options.showYAxisTicks,
        type: options.type,
        xLabel: options.xLabel,
        yLabel: options.yLabel,
      }),
      width,
    });

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
  }, [height, options, router, subjectId, width]);

  return (
    <div className="h-full w-full" ref={parentRef}>
      <div ref={containerRef} />
    </div>
  );
};

export default PlotFigure;
