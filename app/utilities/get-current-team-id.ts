import createServerSupabaseClient from './create-server-supabase-client';

const getCurrentTeamId = async () =>
  (await createServerSupabaseClient().auth.getUser())?.data?.user?.id;

export default getCurrentTeamId;
