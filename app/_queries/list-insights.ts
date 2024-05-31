'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInsights = (subjectId: string) =>
  createServerSupabaseClient()
    .from('insights')
    .select('config, id, name')
    .eq('subject_id', subjectId);

export type ListInsightsData = Awaited<ReturnType<typeof listInsights>>['data'];

export default listInsights;
