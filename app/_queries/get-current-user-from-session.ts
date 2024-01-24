import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getCurrentUserFromSession = async () =>
  (await createServerSupabaseClient().auth.getSession())?.data?.session?.user;

export default getCurrentUserFromSession;
