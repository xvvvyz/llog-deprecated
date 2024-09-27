'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInsights = async (subjectId: string) =>
  (await createServerSupabaseClient())
    .from('insights')
    .select('config, id, name, order')
    .eq('subject_id', subjectId)
    .order('order');

export type ListInsightsData = Awaited<ReturnType<typeof listInsights>>['data'];

export default listInsights;
