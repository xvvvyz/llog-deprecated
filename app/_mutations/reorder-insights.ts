'use server';

import listInsights from '@/_queries/list-insights';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const reorderInsights = async ({
  insightIds,
  subjectId,
}: {
  insightIds?: string[];
  subjectId: string;
}) => {
  const supabase = createServerSupabaseClient();

  // hack because supabase doesn't support bulk updates without all columns
  // this introduces the possibility of a race condition
  const { data: insights } = await listInsights(subjectId);

  if (!insights?.length) return;

  if (!insightIds) {
    await supabase.from('insights').upsert(
      insights.map((insight, order) => ({
        ...insight,
        order,
        subject_id: subjectId,
      })),
    );
  } else {
    const insightIdMap = insights.reduce<Record<string, (typeof insights)[0]>>(
      (acc, insight) => {
        acc[insight.id] = insight;
        return acc;
      },
      {},
    );

    await supabase.from('insights').upsert(
      insightIds.map((insightId, order) => ({
        ...insightIdMap[insightId],
        order,
        subject_id: subjectId,
      })),
    );
  }

  revalidatePath('/', 'layout');
};

export default reorderInsights;
