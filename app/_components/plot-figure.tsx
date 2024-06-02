'use client';

import ChartType from '@/_constants/enum-chart-type';
import formatMarks from '@/_utilities/format-marks';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { plot } from '@observablehq/plot';
import { useParentSize } from '@visx/responsive';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PlotFigure = ({
  isPublic,
  options,
  quantitativeYHeight,
  subjectId,
}: {
  isPublic?: boolean;
  options: {
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
    xLabel: string;
    yLabel: string;
  };
  quantitativeYHeight?: number;
  subjectId: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { parentRef, width } = useParentSize();

  useEffect(() => {
    if (!containerRef.current) return;

    const p = plot({
      height: options.events.some((e) => typeof e[options.yLabel] === 'number')
        ? quantitativeYHeight
        : undefined,
      marginBottom: Number(options.marginBottom),
      marginLeft: Number(options.marginLeft),
      marginRight: Number(options.marginRight),
      marginTop: Number(options.marginTop),
      marks: formatMarks({
        curveFunction: options.curveFunction,
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
  }, [isPublic, options, router, quantitativeYHeight, subjectId, width]);

  return (
    <div className="h-full w-full" ref={parentRef}>
      <div ref={containerRef} />
    </div>
  );
};

export default PlotFigure;
