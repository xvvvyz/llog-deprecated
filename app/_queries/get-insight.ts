import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getInsight = (insightId: string) =>
  createServerSupabaseClient()
    .from('insights')
    .select('config, id, name')
    .eq('id', insightId)
    .single();

export type GetInsightData = Awaited<ReturnType<typeof getInsight>>['data'];

export default getInsight;
