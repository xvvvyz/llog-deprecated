import getInsight from '@/_queries/get-insight';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicInsight = (insightId: string) =>
  createServerSupabaseClient().rpc('get_public_insight', {
    public_insight_id: insightId,
  }) as ReturnType<typeof getInsight>;

export default getPublicInsight;
