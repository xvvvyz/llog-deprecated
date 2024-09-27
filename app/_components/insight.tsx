'use client';

import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import InsightMenu from '@/_components/insight-menu';
import InsightPlot from '@/_components/insight-plot';
import { ListEventsData } from '@/_queries/list-events';
import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';
import { useSortable } from '@dnd-kit/sortable';
import ArrowsPointingOutIcon from '@heroicons/react/24/outline/ArrowsPointingOutIcon';
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon';
import { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';

interface InsightProps {
  activeId: string | null;
  config: InsightConfigJson;
  events: ListEventsData;
  insight: NonNullable<ListInsightsData>[0];
  isPublic?: boolean;
  isReadOnly: boolean;
  searchString: string;
  setActiveId?: Dispatch<SetStateAction<string | null>>;
  setSyncDate?: Dispatch<SetStateAction<Date | null>>;
  shareOrSubjects: 'share' | 'subjects';
  subjectId: string;
  syncDate: Date | null;
}

const Insight = ({
  activeId,
  config,
  events,
  insight,
  isPublic,
  isReadOnly,
  searchString,
  setActiveId,
  setSyncDate,
  shareOrSubjects,
  subjectId,
  syncDate,
}: InsightProps) => {
  const sortableInsight = useSortable({ id: insight.id });

  return (
    <div
      className={twMerge(
        'min-h-12 rounded border border-alpha-1 bg-bg-3',
        sortableInsight.isDragging && 'relative z-10 drop-shadow-2xl',
      )}
      ref={sortableInsight.setNodeRef}
      style={{
        transform: sortableInsight.transform
          ? sortableInsight.isDragging
            ? `translate(${sortableInsight.transform.x}px, ${sortableInsight.transform.y}px) scale(1.03)`
            : `translate(${sortableInsight.transform.x}px, ${sortableInsight.transform.y}px)`
          : undefined,
        transition: sortableInsight.transition,
      }}
    >
      <div className="-mb-4 flex items-stretch">
        {!isReadOnly && (
          <IconButton
            className="m-0 h-full cursor-ns-resize touch-none px-4"
            icon={<Bars2Icon className="w-5" />}
            {...sortableInsight.attributes}
            {...sortableInsight.listeners}
          />
        )}
        <Button
          className={twMerge(
            'm-0 flex w-full min-w-0 gap-4 px-4 pt-3 leading-snug',
            !isReadOnly && 'px-0',
          )}
          href={`/${shareOrSubjects}/${subjectId}/insights/${insight.id}${searchString}`}
          variant="link"
        >
          <div className="min-w-0">
            <div className="truncate">{insight.name}</div>
          </div>
          <ArrowsPointingOutIcon className="ml-auto w-5 shrink-0" />
        </Button>
        {!isReadOnly && (
          <InsightMenu insightId={insight.id} subjectId={subjectId} />
        )}
      </div>
      <InsightPlot
        annotationIncludeEventsFrom={config.annotationIncludeEventsFrom}
        annotationInputId={config.annotationInput}
        annotationInputOptions={config.annotationInputOptions}
        events={events}
        id={insight.id}
        includeEventsFrom={config.includeEventsFrom}
        includeEventsSince={config.includeEventsSince}
        inputId={config.input}
        inputOptions={config.inputOptions}
        interval={config.interval}
        isPublic={isPublic}
        lineCurveFunction={config.lineCurveFunction}
        marginBottom={config.marginBottom}
        marginLeft={config.marginLeft}
        marginRight={config.marginRight}
        marginTop={config.marginTop}
        reducer={config.reducer}
        setActiveId={setActiveId}
        setSyncDate={setSyncDate}
        showLinearRegression={config.showLinearRegression}
        showLinearRegressionConfidence={config.showLinearRegressionConfidence}
        subjectId={subjectId}
        syncDate={insight.id === activeId ? null : syncDate}
        title={insight.name}
        type={config.type}
      />
    </div>
  );
};

export default Insight;
