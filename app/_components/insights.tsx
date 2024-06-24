'use client';

import Button from '@/_components/button';
import InsightCardMenu from '@/_components/insight-card-menu';
import PlotFigure from '@/_components/plot-figure';
import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatInputIdLabelMap from '@/_utilities/format-input-id-label-map';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface InsightsProps {
  events: ReturnType<typeof formatTabularEvents>;
  idLabelMap: ReturnType<typeof formatInputIdLabelMap>;
  insights: NonNullable<ListInsightsData>;
  isPublic?: boolean;
  isTeamMember: boolean;
  searchString: string;
  shareOrSubjects: 'share' | 'subjects';
  subjectId: string;
}

const Insights = ({
  events,
  idLabelMap,
  insights,
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

    return (
      <article
        className="rounded border border-alpha-1 bg-bg-2 pt-1"
        key={insight.id}
      >
        <div className="border-b border-alpha-1 pb-1">
          <div className="flex items-stretch hover:bg-alpha-1">
            <Button
              className={twMerge(
                'm-0 flex w-full gap-4 px-4 py-3 leading-snug',
                isTeamMember && 'pr-0',
              )}
              href={`/${shareOrSubjects}/${subjectId}/insights/${insight.id}${searchString}`}
              scroll={false}
              variant="link"
            >
              {insight.name}
              {!isTeamMember && (
                <ArrowUpRightIcon className="ml-auto w-5 shrink-0" />
              )}
            </Button>
            {isTeamMember && (
              <InsightCardMenu insightId={insight.id} subjectId={subjectId} />
            )}
          </div>
        </div>
        <div className="rounded-b bg-alpha-reverse-1">
          <PlotFigure
            column={idLabelMap[config.input]}
            curveFunction={config.curveFunction}
            defaultHeight={250}
            events={events}
            id={insight.id}
            isPublic={isPublic}
            marginBottom={config.marginBottom}
            marginLeft={config.marginLeft}
            marginRight={config.marginRight}
            marginTop={config.marginTop}
            setActiveId={setActiveId}
            setSyncDate={setSyncDate}
            showDots={config.showDots}
            showLine={config.showLine}
            showLinearRegression={config.showLinearRegression}
            showXAxisLabel={config.showXAxisLabel}
            showXAxisTicks={config.showXAxisTicks}
            showYAxisLabel={config.showYAxisLabel}
            showYAxisTicks={config.showYAxisTicks}
            subjectId={subjectId}
            syncDate={insight.id === activeId ? null : syncDate}
            title={insight.name}
            type={config.type}
          />
        </div>
      </article>
    );
  });
};

export default Insights;
