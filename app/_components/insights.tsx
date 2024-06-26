'use client';

import Button from '@/_components/button';
import InsightCardMenu from '@/_components/insight-card-menu';
import PlotFigure from '@/_components/plot-figure';
import NOMINAL_INPUT_TYPES from '@/_constants/constant-nominal-input-types';
import { ListInputLabelsByIdData } from '@/_queries/list-inputs-by-ids';
import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { keyBy } from 'lodash';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface InsightsProps {
  events: ReturnType<typeof formatTabularEvents>;
  inputs: ListInputLabelsByIdData;
  insights: NonNullable<ListInsightsData>;
  isPublic?: boolean;
  isTeamMember: boolean;
  searchString: string;
  shareOrSubjects: 'share' | 'subjects';
  subjectId: string;
}

const Insights = ({
  events,
  inputs,
  insights,
  isPublic,
  isTeamMember,
  searchString,
  shareOrSubjects,
  subjectId,
}: InsightsProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [syncDate, setSyncDate] = useState<Date | null>(null);
  const idInputMap = keyBy(inputs, 'id');

  return insights.map((insight) => {
    const config = insight.config as InsightConfigJson;
    const input = idInputMap[config.input];
    if (!input) return null;

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
            defaultHeight={250}
            barInterval={config.barInterval}
            barReducer={config.barReducer}
            showBars={config.showBars}
            events={events}
            id={insight.id}
            input={input.label}
            inputIsNominal={NOMINAL_INPUT_TYPES.includes(input.type)}
            isPublic={isPublic}
            lineCurveFunction={config.lineCurveFunction}
            marginBottom={config.marginBottom}
            marginLeft={config.marginLeft}
            marginRight={config.marginRight}
            marginTop={config.marginTop}
            setActiveId={setActiveId}
            setSyncDate={setSyncDate}
            showDots={config.showDots}
            showLine={config.showLine}
            showLinearRegression={config.showLinearRegression}
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
