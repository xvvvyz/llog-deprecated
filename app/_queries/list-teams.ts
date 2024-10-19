import SubscriptionStatus from '@/_constants/enum-subscription-status';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTeams = async () => {
  const supabase = await createServerSupabaseClient();
  const user = await getCurrentUser();

  const { data: teamIds } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', user?.id ?? '');

  return supabase
    .from('teams')
    .select('id, image_uri, name, subscriptions(id, profile_id, variant)')
    .in(
      'id',
      (teamIds ?? []).map((teamMember) => teamMember.team_id),
    )
    .eq('subscriptions.status', SubscriptionStatus.Active)
    .order('name');
};

export type ListTeamsData = Awaited<ReturnType<typeof listTeams>>['data'];

export default listTeams;
