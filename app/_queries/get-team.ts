import SubscriptionStatus from '@/_constants/enum-subscription-status';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTeam = async (teamId: string) =>
  (await createServerSupabaseClient())
    .from('teams')
    .select('id, image_uri, name, subscriptions(id, profile_id, variant)')
    .eq('id', teamId)
    .eq('subscriptions.status', SubscriptionStatus.Active)
    .single();

export type GetTeamData = Awaited<ReturnType<typeof getTeam>>['data'];

export default getTeam;
