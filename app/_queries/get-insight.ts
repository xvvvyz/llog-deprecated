import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getInsight = async (insightId: string) =>
  (await createServerSupabaseClient())
    .from('insights')
    .select('config, id, name, order')
    .eq('id', insightId)
    .single();

export type GetInsightData = Awaited<ReturnType<typeof getInsight>>['data'];

export default getInsight;
