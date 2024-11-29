'use client';

import Insight from '@/_components/insight';
import reorderInsights from '@/_mutations/reorder-insights';
import { ListEventsData } from '@/_queries/list-events';
import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';
import * as DndCore from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import * as DndSortable from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

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
  insights: originalInsights,
  isArchived,
  isPublic,
  isTeamMember,
  searchString,
  shareOrSubjects,
  subjectId,
}: InsightsProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [syncDate, setSyncDate] = useState<Date | null>(null);
  const [insights, setInsights] = useState<typeof originalInsights>([]);
  const sensors = DndCore.useSensors(DndCore.useSensor(DndCore.PointerSensor));
  useEffect(() => setInsights(originalInsights), [originalInsights]);

  return (
    <DndCore.DndContext
      collisionDetection={DndCore.closestCenter}
      id="insights"
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={({ active, over }: DndCore.DragEndEvent) => {
        if (!over || active.id === over?.id) return;
        const oldIndex = insights.findIndex(({ id }) => id === active.id);
        const newIndex = insights.findIndex(({ id }) => id === over?.id);
        const newInsights = DndSortable.arrayMove(insights, oldIndex, newIndex);

        void reorderInsights({
          insightIds: newInsights.map((insight) => insight.id),
          subjectId,
        });

        setInsights(newInsights);
      }}
      sensors={sensors}
    >
      <DndSortable.SortableContext
        items={insights.map((insight) => insight.id)}
        strategy={DndSortable.verticalListSortingStrategy}
      >
        {insights.map((insight) => (
          <Insight
            activeId={activeId}
            config={insight.config as InsightConfigJson}
            events={events}
            insight={insight}
            isPublic={isPublic}
            isReadOnly={!isTeamMember || !!isArchived}
            key={insight.id}
            searchString={searchString}
            setActiveId={setActiveId}
            setSyncDate={setSyncDate}
            shareOrSubjects={shareOrSubjects}
            subjectId={subjectId}
            syncDate={syncDate}
          />
        ))}
      </DndSortable.SortableContext>
    </DndCore.DndContext>
  );
};

export default Insights;
