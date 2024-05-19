'use server';

import { InsightFormValues } from '@/_components/insight-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const upsertInsight = async (
  context: { insightId?: string; subjectId: string },
  { name, ...config }: InsightFormValues,
) => {
  const { error } = await createServerSupabaseClient().from('insights').upsert({
    config,
    id: context.insightId,
    name,
    subject_id: context.subjectId,
  });

  if (error) return { error: error.message };
};

export default upsertInsight;
