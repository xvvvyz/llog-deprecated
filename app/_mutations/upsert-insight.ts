'use server';

import { InsightFormValues } from '@/_components/insight-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertInsight = async (
  context: { insightId?: string; subjectId: string },
  { name, ...config }: InsightFormValues,
) => {
  const { error } = await createServerSupabaseClient().from('insights').upsert({
    config,
    id: context.insightId,
    name: name.trim(),
    subject_id: context.subjectId,
  });

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
};

export default upsertInsight;
