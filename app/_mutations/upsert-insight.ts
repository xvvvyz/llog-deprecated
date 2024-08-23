'use server';

import { InsightFormValues } from '@/_components/insight-form';
import reorderInsights from '@/_mutations/reorder-insights';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertInsight = async (
  context: { insightId?: string; subjectId: string },
  { name, order, ...config }: InsightFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('insights').upsert({
    config,
    id: context.insightId,
    name: name.trim(),
    order: order ?? -1,
    subject_id: context.subjectId,
  });

  if (error) return { error: error.message };

  if (typeof order === 'undefined') {
    await reorderInsights({ subjectId: context.subjectId });
  }

  revalidatePath('/', 'layout');
};

export default upsertInsight;
