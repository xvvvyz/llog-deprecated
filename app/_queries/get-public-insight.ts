import getInsight from '@/_queries/get-insight';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicInsight = async (insightId: string) =>
  (await createServerSupabaseClient()).rpc('get_public_insight', {
    public_insight_id: insightId,
  }) as unknown as ReturnType<typeof getInsight>;

export default getPublicInsight;
