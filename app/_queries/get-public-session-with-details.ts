import getSessionWithDetails from '@/_queries/get-session-with-details';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicSessionWithDetails = (sessionId: string) =>
  createServerSupabaseClient().rpc('get_public_session_with_details', {
    public_session_id: sessionId,
  }) as ReturnType<typeof getSessionWithDetails>;

export default getPublicSessionWithDetails;
