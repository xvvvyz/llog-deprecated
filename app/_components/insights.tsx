'use client';

import Button from '@/_components/button';
import InsightMenu from '@/_components/insight-menu';
import PlotFigure from '@/_components/plot-figure';
import { ListEventsData } from '@/_queries/list-events';
import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface InsightsProps {
  events: ListEventsData;
  insights: NonNullable<ListInsightsData>;
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember: boolean;
  searchString: string;
  shareOrSubjects: 'share' | 'subjects';
  subjectId: string;
}

const Insights = ({
  events,
  insights,
  isArchived,
  isPublic,
  isTeamMember,
  searchString,
  shareOrSubjects,
  subjectId,
}: InsightsProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [syncDate, setSyncDate] = useState<Date | null>(null);

  return insights.map((insight) => {
    const config = insight.config as InsightConfigJson;
    const isReadOnly = !isTeamMember || isArchived;

    return (
      <div
        className="min-h-12 rounded border border-alpha-1 bg-bg-3 drop-shadow-2xl"
        key={insight.id}
      >
        <div className="-mb-4 flex items-stretch">
          <Button
            className={twMerge(
              'm-0 flex w-full gap-4 px-4 pt-3 leading-snug',
              !isReadOnly && 'pr-0',
            )}
            href={`/${shareOrSubjects}/${subjectId}/insights/${insight.id}${searchString}`}
            scroll={false}
            variant="link"
          >
            {insight.name}
            {isReadOnly && (
              <ArrowUpRightIcon className="ml-auto w-5 shrink-0" />
            )}
          </Button>
          {!isReadOnly && (
            <InsightMenu insightId={insight.id} subjectId={subjectId} />
          )}
        </div>
        <PlotFigure
          barInterval={config.barInterval}
          barReducer={config.barReducer}
          defaultHeight={200}
          events={events}
          id={insight.id}
          includeEventsFrom={config.includeEventsFrom}
          includeEventsSince={config.includeEventsSince}
          inputId={config.input}
          isPublic={isPublic}
          lineCurveFunction={config.lineCurveFunction}
          marginBottom={config.marginBottom}
          marginLeft={config.marginLeft}
          marginRight={config.marginRight}
          marginTop={config.marginTop}
          setActiveId={setActiveId}
          setSyncDate={setSyncDate}
          showBars={config.showBars}
          showDots={config.showDots}
          showLine={config.showLine}
          showLinearRegression={config.showLinearRegression}
          subjectId={subjectId}
          syncDate={insight.id === activeId ? null : syncDate}
          title={insight.name}
          type={config.type}
        />
      </div>
    );
  });
};

export default Insights;
