import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getCurrentUser = async () =>
  (await (await createServerSupabaseClient()).auth.getUser())?.data?.user;

export default getCurrentUser;
