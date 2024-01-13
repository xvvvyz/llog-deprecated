import createServerComponentClient from '@/_server/create-server-component-client';
import getSessionWithDetails from '@/_server/get-session-with-details';

const getPublicSessionWithDetails = (sessionId: string) =>
  createServerComponentClient().rpc('get_public_session_with_details', {
    public_session_id: sessionId,
  }) as ReturnType<typeof getSessionWithDetails>;

export default getPublicSessionWithDetails;
