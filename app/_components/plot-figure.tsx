'use client';

import { useParentSize } from '@cutting/use-get-parent-size';
import { plot, PlotOptions } from '@observablehq/plot';
import { useEffect, useRef } from 'react';

const PlotFigure = ({
  onClick,
  options,
}: {
  onClick?: (p: ReturnType<typeof plot>) => void;
  options: PlotOptions;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const { width } = useParentSize(parentRef);

  useEffect(() => {
    if (!containerRef.current) return;
    const p = plot({ width, ...options });
    p.addEventListener('click', () => onClick?.(p));
    containerRef.current.append(p);
    return () => p.remove();
  }, [onClick, options, width]);

  return (
    <div className="aspect-video bg-alpha-reverse-1" ref={parentRef}>
      <div ref={containerRef} />
    </div>
  );
};

export default PlotFigure;
